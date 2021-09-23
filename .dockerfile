# NodeJS 12 slim because it works
FROM node:12-slim

# The base doesn't have all the dependencies for Puppeteer, so we've gotta add them
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Create the working directory for the app
WORKDIR /app

# Inject production ENV
ENV NODE_ENV=production

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY ["package.json", "package-lock.json*", "./"]

# Install dependencies 
RUN npm install --production

# Copy the important files
COPY . .

# Gotta made chromium executable
RUN chmod -R o+rwx node_modules/puppeteer/.local-chromium

# Start the show
CMD [ "node", "index.js" ]