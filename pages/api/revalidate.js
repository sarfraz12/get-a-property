/**
 * This code is responsible for revalidating the cache when a post is updated.
 *
 * It is set up to receive a validated GROQ-powered Webhook from Sanity.io:
 * https://www.sanity.io/docs/webhooks
 *
 * 0. Create a Token with editor role
 * 1. Go to the API section of your Sanity project on sanity.io/manage or run `npx sanity hook create`
 * 2. Click "Create webhook"
 * 3. Set the Name & Description
 * 4. Set the URL to https://YOUR_NEXTJS_SITE_URL/api/revalidate
 * 5. Choose Dataset to "production" or choose the one you prefer.
 * 6. Trigger on: "Create", "Update", and "Delete"
 * 7. Set Filter: _type == "post"
 * 8. Projection: Leave empty
 * 9. Status: Keep it enabled
 * 10. HTTP method: POST
 * 11. HTTP Headers: Leave empty
 * 12. API version: v2021-03-25
 * 13. Include drafts: No
 * 14. Secret: Set to the same value as SANITY_REVALIDATE_SECRET (create a random one if you haven't)
 * 15. Save the cofiguration
 * 16. Add the secret to Vercel: `npx vercel env add SANITY_REVALIDATE_SECRET`
 * 17. Redeploy with `npx vercel --prod` to apply the new environment variable
 */

import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import { getCategoriesById } from "@/lib/sanity/client";

const secret = process.env.SANITY_REVALIDATE_SECRET

const languages = ['en', 'es'];

export default async function revalidate(req, res) {

    console.log("estoy en paage", req)

    console.log("header", req.headers)

    // SECURITY LEVEL

    const signature = req.headers[SIGNATURE_HEADER_NAME]

    console.log("signature", req.query['sanity-webhook-signature'])

    const body = await readBody(req) // Read the body into a string
    if (!(await isValidSignature(body, signature, secret))) {
        res.status(401).json({ success: false, message: 'Invalid signature -s' })
        return
    }

    console.log("req path", req.path)

    const jsonBody = JSON.parse(body)

    console.log("body path", jsonBody.path)

    console.log("body", jsonBody)

    console.log("document type", jsonBody._type)

    // just when post is updated 
    const staleRoutes = []
    if (jsonBody._type == "post") {

        // categories slug to revalidate the path
        const categoryIds = jsonBody.categories.map(category => category?._ref);

        // Fetch category slugs from Sanity based on categoryIds
        const categoryPromises = categoryIds.map(async categoryId => {
            const categories = await getCategoriesById(categoryId); // groq is defined to bring [0]
            return categories?.slug; // Assuming slug is a field in your category schema
        });

        // Wait for all category slug retrievals to complete
        const categorySlugs = await Promise.all(categoryPromises);


        // Generate routes for each language


        languages.map(lang => {
            staleRoutes.push(`/${lang}`);
            staleRoutes.push(`/${lang}/all/post/${jsonBody.slug.current}`);
            staleRoutes.push(`/${lang}/sidebar/post/${jsonBody.slug.current}`);
            staleRoutes.push(`/${lang}/contact`);
            staleRoutes.push(`/${lang}/aboutUs`);
            staleRoutes.push(`/${lang}/search`);
            staleRoutes.push(`/${lang}/all`);
            

            // Add category slugs if they exist
            categorySlugs.map(categorySlug => {
                if (categorySlug) {
                    staleRoutes.push(`/${lang}/${categorySlug}`);
                    staleRoutes.push(`/${lang}/${categorySlug}/post/${jsonBody.slug.current}`);
                }
            });
        });
    } else {


        languages.map(lang => {
            staleRoutes.push(`/${lang}`);
            staleRoutes.push(`/${lang}/contact`);
            staleRoutes.push(`/${lang}/search`);
            staleRoutes.push(`/${lang}/all`);
            staleRoutes.push(`/${lang}/aboutUs`);
           
        });
    }



    if (!Array.isArray(staleRoutes)) {
        return res.status(400).json({ message: 'Paths should be an array' });
    }


    console.log("paths to revalidate", staleRoutes)

    try {
        const revalidatedPaths = [];
        for (const path of staleRoutes) {
            console.log(`Revalidating path: ${path}`);
            try {
                await res.revalidate(path);
                revalidatedPaths.push(path);
            } catch (err) {
                console.error(`Error revalidating path: ${path}`, err.message);
                return null; // return null for failed revalidations
            }
        }

        if (revalidatedPaths.length === 0) {
            throw new Error('No paths revalidated');
        }

        console.log('Revalidation successful for paths:', revalidatedPaths);

        return res.json({ revalidated: true, revalidatedPaths });
    } catch (err) {
        console.error('Error during revalidation', err.message);
        return res.status(500).json({ message: 'Error revalidating at end' }, err.message);
    }


}

// Next.js will by default parse the body, which can lead to invalid signatures
export const config = {
    api: {
        bodyParser: false,
    },
}

async function readBody(readable) {
    const chunks = []
    for await (const chunk of readable) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
    }
    return Buffer.concat(chunks).toString('utf8')
}

