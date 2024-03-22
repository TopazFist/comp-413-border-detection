import express from "express";
import {PrismaSessionStore} from "@quixo3/prisma-session-store";
import expressSession from "express-session";
import cors from "cors";
import prisma from "./constants/config.js";

const app = express();
