import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
  // when it was set t true we will not get real time data
  // data was cached for 60 seconds, so even after multiple reloads, the data was not updated and only the cached data was returned.
  // untill it was revalidated after 60seconds and then we get the updated data
  // so we set it to false
})
