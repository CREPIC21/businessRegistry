FROM node:16-alpine
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 5000
CMD npm run dev

# build a image
# - docker build -t crepic21/hello-world-bsnodejs:0.0.1.RELEASE .
# - docker build -t crepic21/hello-world-bsnodejs:0.0.2.RELEASE .

# run the container from the image
# - docker run -i -t -d -p 5000:5000 crepic21/hello-world-bsnodejs:0.0.1.RELEASE
# - docker run -i -t -d -p 5001:5000 crepic21/hello-world-bsnodejs:0.0.2.RELEASE

# check history 
# - docker history <image_id>

# check logs 
# - docker logs -f <container_id>

# push to dockerhub
# - login in terminal first "docker login"
# - docker push crepic21/hello-world-bsnodejs:0.0.1.RELEASE
# - docker push crepic21/hello-world-bsnodejs:0.0.2.RELEASE