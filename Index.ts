// Models
// import TestMessage from './Models/TestMessage';
// import SloganTShirt from './Models/SloganTShirt';
// import FruitTransaction from './Models/FruitTransaction';
// Database
import Controller, { controller } from './Database/Controller';
import { addModels } from './Database/DataLayer';
import { repo } from './Database/Repository';
import YoutubeVideo from './Models/YoutubeVideo';
import express, { Request, Response } from 'express';

// Add models to database
addModels();



// const R_YoutubeVideo = repo(YoutubeVideo);

// const video = YoutubeHelper.retrieveVideoInfoFromId('dQw4w9WgXcQ').then(video => {
//         R_YoutubeVideo.create(video).then(
//                 _ => R_YoutubeVideo.all().then(videos => {
//                         console.log(videos);
//                 })
//         );
// });

// const youtubeController = controller(YoutubeVideo);

// Write a new route for adding a video to the database, retrieving the info from youtube

// const video = YoutubeHelper.retrieveVideoInfoFromId('dQw4w9WgXcQ').then(video => {
//     youtubeController.create({ body: video } as unknown as Request<{}, {}, YoutubeVideo, {}, {}>, null as unknown as Response<YoutubeVideo>);
// }).then(_ => {
//     youtubeController.all({} as Request, null as unknown as Response<YoutubeVideo[]>);
// })


const testMessageController = controller(TestMessage);


// Create express app
const app = express();
app.use(express.json());
// app.use('/youtube', youtubeController.router);
app.use('/test', testMessageController.router);
// Start server
const port = 3000;
app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
});


