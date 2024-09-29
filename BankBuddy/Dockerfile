FROM openjdk:17-alpine

WORKDIR /opt

ENV PORT 8080
EXPOSE 8080

# Install required libraries
RUN apk update && apk add --no-cache tesseract-ocr

ENV LC_ALL=C
ENV TESSDATA_PREFIX=/usr/share/tessdata

COPY target/*.jar /opt/app.jar

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]
