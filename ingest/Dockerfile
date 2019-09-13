FROM openjdk:8-jdk-alpine
VOLUME /tmp
ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} app.jar
ADD ./newrelic newrelic

ENTRYPOINT ["java","-javaagent:newrelic/newrelic.jar","-jar","/app.jar"]
#ENTRYPOINT ["java","-jar","/app.jar"]