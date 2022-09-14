import express from 'express';
const app = express();
import cors from 'cors';
import morgan from 'morgan';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { LowSync, JSONFileSync } from 'lowdb';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import booksRoutes from './routes/books.js';

const PORT = process.env.PORT || 7000;

const __dirname = dirname(fileURLToPath(import.meta.url));

const file = join(__dirname, 'db.json');
const adapter = new JSONFileSync(file);
const db = new LowSync(adapter);
db.read()
db.data ||= { books:[] }
db.write()


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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
app.db = db;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/books', booksRoutes)


app.listen(PORT, () => console.log(`server running on ${PORT}`))