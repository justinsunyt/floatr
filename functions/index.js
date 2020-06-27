const functions = require('firebase-functions')
const algoliasearch = require('algoliasearch')

const ALGOLIA_ID = functions.config().algolia.app_id
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key

const ALGOLIA_INDEX_NAME = process.env.GCLOUD_PROJECT === 'floatrrr' ? 'prod_classes' : 'dev_classes'
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY)
const index = client.initIndex(ALGOLIA_INDEX_NAME)

exports.onClassWrite = functions.firestore.document('classes/{classId}').onWrite((change, context) => {
    if (!change.after.exists) {
        return index.deleteObject(context.params.classId)
    } else {
        const cl = change.after.data()
        cl.objectID = context.params.classId
        return index.saveObject(cl)
    }
})