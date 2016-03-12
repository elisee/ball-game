/// <reference path="../typings/browser.d.ts" />
/// <reference path="../shared.d.ts" />

import * as matchRenderer from "./matchRenderer";
import * as gameClient from "./gameClient";

matchRenderer.start();
gameClient.connect();
