import Bao from "baojs";
import { getChangelogs, getChangelogById, insertChangelog } from './controllers/controller';
//import { seedDatabase } from "./scripts/db-seed";
//import { initializeDatabase } from "./lib/db";
const app = new Bao();
//async function startApplication() {
//    await initializeDatabase(); 
//    await seedDatabase(); 
//    app.listen();
//    console.log("Server running on http://localhost:5000");
//  }
  interface ChangelogRequestBody {
    readmePath: string;
    version: string;
    date: string;
    author: string;
    // Include any other relevant fields according to your current changelog structure
}

//startApplication().catch(console.error);

app.get("/", (ctx) => {
    let sendMessage = 'Welcome to the Changelog Application!';
    return ctx.sendJson({ message: sendMessage }, { headers: { "Content-Type": "application/json" }, status: 200 });
});

app.get("/changelog", async (ctx) => {
    try {
        const changelog = await getChangelogs();
        return ctx.sendJson({ changelog }, { headers: { "Content-Type": "application/json" },status: 200 });
    } catch (err) {
        let errorMessage = "Failed to fetch changelogs";
        if (err instanceof Error) {
            errorMessage = err.message;
        }
        return ctx.sendJson({ Error: errorMessage }, { headers: { "Content-Type": "application/json" }, status: 500 });
    }
});

app.get("/changelog/:id", async (ctx) => {
    try {
        const entry = await getChangelogById(ctx.params.id);
        if (entry) {
            return ctx.sendJson({ entry }, { headers: { "Content-Type": "application/json" },status: 200 });
        } else {
            return ctx.sendJson({ error: "Changelog entry not found" }, { headers: { "Content-Type": "application/json" },status: 404 });
        }
    } catch (err) {
        let errorMessage = "Failed to fetch changelog by ID";
        if (err instanceof Error) {
            errorMessage = err.message;
        }
        return ctx.sendJson({ Error: errorMessage }, { headers: { "Content-Type": "application/json" }, status: 500 });
    }
});

app.post("/api/changelog", async (ctx) => {
    try {
        const changelogData: ChangelogRequestBody = await ctx.req.json();
        const result = await insertChangelog(changelogData); // Adjusted to pass the entire data object
        return ctx.sendJson({ result }, {headers: { "Content-Type": "application/json" }, status: 200 });
    } catch (err) {
        let errorMessage = "Failed to insert changelog";
        if (err instanceof Error) {
            errorMessage = err.message;
        }
        return ctx.sendJson({ error: errorMessage }, {headers: { "Content-Type": "application/json" }, status: 500 });
    }
});



console.log("Server running on http://localhost:5000");
app.listen({ port: 5000 });
