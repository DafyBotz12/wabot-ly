FROM nikolaik/python-nodejs:latest



RUN apt-get update && \

  apt-get install -y \

  neofetch \

  chromium \

  ffmpeg \

  webp\
  wget \

  mc \

  imagemagick && \

  rm -rf /var/lib/apt/lists/*



COPY package.json .

RUN npm install

#RUN npm install -g npm-check-updates

#RUN ncu --upgrade

#RUN npm install libwebp



RUN mkdir /Invibotz-V1.2

WORKDIR /Invibotz-V1.2

COPY . /Invibotz-V1.2

RUN python3 -m pip install -r /Invibotz-V1.2/requirements.txt

ENV TZ=Asia/Jakarta

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone



RUN ls



EXPOSE 5000



CMD ["npm", "start"]
