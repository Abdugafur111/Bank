## BankBuddy


Banking software project for CS160 Software Engineering at San Jose State University

Video Guide: https://drive.google.com/file/d/1S5kE4dgoWbOYvWPUQwdBGm0vPjqO1ZiH/view



## Instruction to run the Docker

# Pull the Docker Images
docker pull koreaabdu16/bankbuddy:frontend1

docker pull koreaabdu16/bankbuddy:spring1

# Build the Docker Containers
docker run -d -p 4200:4200 koreaabdu16/bankbuddy:frontend1

docker run -d -p 8080:8080 koreaabdu16/bankbuddy:spring1

# Frontend port 4200 -> http://localhost:4200/
# Backend port 8080 -> http://localhost:8080/

# Hosted Application URL
[http://24.199.105.210:4200/]
 
   
