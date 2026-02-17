module.exports = {
    apps: [
        {
            name: "learnorbit-api",
            script: "./src/app.js",
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: "1G",
            env: {
                NODE_ENV: "production",
            },
        },
        {
            name: "learnorbit-worker",
            script: "./src/workers/email.worker.js",
            instances: 1, // Workers usually shouldn't be clustered unless queue handles it
            autorestart: true,
            watch: false,
            max_memory_restart: "500M",
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
