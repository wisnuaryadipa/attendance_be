import express, { Application } from "express";

const v1 = (app: Application) => {
    app.get('/status', (req, res) => {
      res.send('Express + TypeScript Server')
    });
}

export default v1;
