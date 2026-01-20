/**
 * Fetch function
 *
 * @param   {string | URL | import('./request').default} url - Absolute url or Request instance
 * @param   {*} [options_] - Fetch options
 * @return  {Promise<import('./response').default>}
 */
export default function fetch(url: string | URL | any, options_?: any): Promise<any>;
import { Blob } from "fetch-blob/from.js";
import { blobFrom } from "fetch-blob/from.js";
import { blobFromSync } from "fetch-blob/from.js";
import { File } from "fetch-blob/from.js";
import { fileFrom } from "fetch-blob/from.js";
import { fileFromSync } from "fetch-blob/from.js";
import { FormData } from "formdata-polyfill/esm.min.js";
export { AbortError, Blob, blobFrom, blobFromSync, FetchError, File, fileFrom, fileFromSync, FormData, Headers, isRedirect, Request, Response };
