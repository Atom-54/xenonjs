// import hnswlib from "hnswlib-node";
// import duckdb from "duckdb";
// import makeDir from "make-dir";
// import fs from "fs";

export class PathMaker {
    path;
    constructor(path) {
        this.path = path;
    }
    // async ensure() {
    //     await makeDir(this.path);
    // }
    // filesExist() {
    //     return (fs.existsSync(this.databaseFile) && fs.existsSync(this.vectorIndexFile));
    // }
    // exists() {
    //     return fs.existsSync(this.path);
    // }
    get databaseFile() {
        return `${this.path}/database.db`;
    }
    get vectorIndexFile() {
        return `${this.path}/vector.idx`;
    }
}
const READ_ONLY_ACCESS_MODE = 1;
export class VectorStore {
//     path;
//     dimensions;
//     hnsw;
//     duckdb;
//     constructor(path, dimensions) {
//         this.path = path;
//         this.dimensions = dimensions;
//     }
//     async createReader() {
//         if (this.duckdb && this.hnsw)
//             return new VectorStoreReader(this);
//         const pathMaker = new PathMaker(this.path);
//         if (!pathMaker.filesExist()) {
//             throw new Error(`Store "${this.path}" does not exist`);
//         }
//         this.duckdb = new duckdb.Database(pathMaker.databaseFile, READ_ONLY_ACCESS_MODE);
//         this.hnsw = new hnswlib.HierarchicalNSW("cosine", this.dimensions);
//         await this.hnsw.readIndex(pathMaker.vectorIndexFile);
//         return new VectorStoreReader(this);
//     }
//     async createWriter() {
//         const pathMaker = new PathMaker(this.path);
//         await pathMaker.ensure();
//         // TODO: Delete existing store files.
//         this.duckdb = new duckdb.Database(pathMaker.databaseFile);
//         this.hnsw = new hnswlib.HierarchicalNSW("cosine", this.dimensions);
//         return new VectorStoreWriter(this);
//     }
//     async close() {
//         if (!this.duckdb)
//             return;
//         const duckdb = this.duckdb;
//         await new Promise((resolve) => {
//             duckdb.close(resolve);
//         });
//     }
// }
// export class VectorStoreReader {
//     hnsw;
//     duckdb;
//     constructor(store) {
//         if (!store.hnsw)
//             throw new Error("hnsw not initialized");
//         if (!store.duckdb)
//             throw new Error("duckdb not initialized");
//         this.hnsw = store.hnsw;
//         this.duckdb = store.duckdb;
//     }
//     async search(query, k) {
//         const results = this.hnsw.searchKnn(query, k);
//         if (!results)
//             throw new Error("No results found");
//         const conn = this.duckdb.connect();
//         const rawBits = await new Promise((resolve, reject) => {
//             conn.all(`SELECT
//           id as id,
//           text as text,
//           token_count as token_count,
//           url as url,
//           image_url as image_url,
//           title as title,
//           description as description,
//           access_tag as access_tag
//           FROM library 
//             WHERE index_label IN (${results.neighbors
//                 .map(() => "?")
//                 .join(",")})`, ...results.neighbors, (err, rows) => {
//                 if (err)
//                     reject(err);
//                 else
//                     resolve(rows);
//             });
//         });
//         return rawBits.map((rawBit) => {
//             const bit = {};
//             if (rawBit.id)
//                 bit.id = rawBit.id;
//             if (rawBit.text)
//                 bit.text = rawBit.text;
//             if (rawBit.token_count)
//                 bit.token_count = rawBit.token_count;
//             if (rawBit.url) {
//                 bit.info = { url: rawBit.url };
//                 if (rawBit.image_url)
//                     bit.info.image_url = rawBit.image_url;
//                 if (rawBit.title)
//                     bit.info.title = rawBit.title;
//                 if (rawBit.description)
//                     bit.info.description = rawBit.description;
//             }
//             if (rawBit.access_tag)
//                 bit.access_tag = rawBit.access_tag;
//             return bit;
//         });
//     }
}
export class VectorStoreWriter {
    // hnsw;
    // duckdb;
    // vectorIndexFilename;
    // constructor(store) {
    //     if (!store.hnsw)
    //         throw new Error("hnsw not initialized");
    //     if (!store.duckdb)
    //         throw new Error("duckdb not initialized");
    //     this.hnsw = store.hnsw;
    //     this.duckdb = store.duckdb;
    //     this.vectorIndexFilename = new PathMaker(store.path).vectorIndexFile;
    // }
    // async write(bits) {
    //     const numElements = bits.length;
    //     const hnsw = this.hnsw;
    //     const db = this.duckdb;
    //     hnsw.initIndex(numElements);
    //     bits.forEach((bit, i) => {
    //         if (!bit.embedding)
    //             return;
    //         hnsw.addPoint(bit.embedding, i);
    //     });
    //     const conn = db.connect();
    //     await new Promise((resolve) => {
    //         conn.exec("DROP TABLE IF EXISTS library", resolve);
    //     });
    //     await new Promise((resolve) => {
    //         conn.exec(`CREATE TABLE library (
    //       id VARCHAR, 
    //       text VARCHAR,
    //       token_count INTEGER,
    //       url VARCHAR, 
    //       image_url VARCHAR,
    //       title VARCHAR,
    //       description VARCHAR,
    //       access_tag VARCHAR,
    //       index_label INTEGER PRIMARY KEY
    //     )`, resolve);
    //     });
    //     const insertion = conn.prepare(`INSERT INTO library
    //     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    //     bits.forEach((bit, i) => insertion.run(bit.id || "", bit.text, bit.token_count || 0, bit.info?.url || "", bit.info?.image_url || "", bit.info?.title || "", bit.info?.description || "", bit.access_tag || "", i));
    //     await new Promise((resolve) => {
    //         insertion.finalize(resolve);
    //     });
    //     await hnsw.writeIndex(this.vectorIndexFilename);
    // }
}
