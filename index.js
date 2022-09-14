import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Low, JSONFile } from 'lowdb'
import swaggerUI from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import booksRoutes from './routes/booksRoutes.js'

const __dirname = dirname(fileURLToPath(import.meta.url));

const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

db.data ||=({books:[]})
await db.write()

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Express-Swagger  API",
            version:"1.0.0",
            description: "Express Swagger API documentation"
        },
        servers: [
            {
                url: "http://localhost:7000"
            }
        ],
    },
    apis: ["./routes/*.js"]
}
const specs = swaggerJsdoc(options)
const app = express();

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))
app.db = db;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/books', booksRoutes)

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => console.log(`server running on ${PORT}`))