import { PineconeClient } from "pinecone-client";
import { PolymathHost } from "./host.js";
// --------------------------------------------------------------------------
// Talk to Pinecone to do the vector search
// --------------------------------------------------------------------------
class PolymathPinecone extends PolymathHost {
    _pinecone;
    _topK;
    constructor(config) {
        super();
        this._pinecone = new PineconeClient(config);
        this._topK = config.topK || 10;
    }
    async query(args) {
        const queryEmbedding = args.query_embedding;
        const result = await this._pinecone.query({
            vector: queryEmbedding,
            topK: this._topK,
            includeMetadata: true,
        });
        // console.log("Pinecone Results: ", result);
        const bits = result?.matches.map((pineconeResult) => {
            return this.makeBit(pineconeResult);
        });
        const libraryData = {
            version: 1,
            embedding_model: "openai.com:text-embedding-ada-002",
            bits: bits,
        };
        return libraryData;
    }
    makeBit(pineconeResult) {
        const bit = {
            id: pineconeResult.id,
        };
        const info = { url: pineconeResult.metadata?.url };
        if (pineconeResult.metadata?.text)
            bit.text = pineconeResult.metadata.text;
        if (pineconeResult.metadata?.token_count)
            bit.token_count = pineconeResult.metadata?.token_count;
        if (pineconeResult.metadata?.access_tag)
            bit.access_tag = pineconeResult.metadata?.access_tag;
        if (pineconeResult.metadata?.image_url)
            info.image_url = pineconeResult.metadata.image_url;
        if (pineconeResult.metadata?.title)
            info.title = pineconeResult.metadata.title;
        if (pineconeResult.metadata?.description)
            info.description = pineconeResult.metadata.description;
        if ("score" in pineconeResult)
            bit.similarity = pineconeResult.score;
        bit.info = info;
        return bit;
    }
}
export { PolymathPinecone };
