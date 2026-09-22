FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw 2>/dev/null || true

RUN ./mvnw clean package -DskipTests || mvn clean package -DskipTests

EXPOSE 10000

CMD ["java", "-jar", "target/campus-placement-portal-0.0.1-SNAPSHOT.jar"]