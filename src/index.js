import express from 'express';
import cors from 'cors';
import { router } from './router/index.js';
import { log } from 'wechaty';
import config from './config.js';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/v1', router);
app.use(function (err, req, res, next) {
    log.info(err.stack);
});
app.listen(config.PORT, '0.0.0.0', () => log.info('服务开启中，请稍后...'));
