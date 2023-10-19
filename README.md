# Task
### Description

Write a class (called “FS”) in TypeScript, that takes a directory as an argument which will act as an interface to a file system.

We need two methods in this class:

store(filename, content): Stores the content in filename within the given directory
get(filename): Returns the content from the filename

However, people are writing the same data over & over, but using different file names. Our product managers have come up with a method for saving a lot of space. So instead of storing the content as a file using the given filename, store the content using the hash of that content.

Let’s assume md5 is a "perfect" hashing function md5("content") -> "abcdef123456"
filename - only alphabetical characters


Example usage:
- fs = FS("/topdir")
- fs.store("filename1", "a very long string1")
- fs.store("filename2", "a very long string1")
- fs.store("filename3", "a very long string3")
- result1 = fs.get("filename1")// gets 'a very long strong1'
- result2 = fs.get("filename2")// gets 'a very long strong1'
- result3 = fs.get("filename3")// gets 'a very long strong3'

In the previous example the “a very long string1” is stored only once because two different files have the same content.

### Submit
Please push your solution to GitHub, and share the link of your solution.

### CI/CD
Write a short description of how would you deploy your solution in a cloud environment (AWS, Azure, GCP). What type of resources would you use and why?

# Solution
### FS.ts
- class that implements the requested logic
- storing the filename in a hashmap, since filenames are its content's hash, we need to store their original name somewhere. This way we can directly access them without iterating.
  - fileMap[fileName] = hash 
- If we want to use this as a microservice, everything has to be async to not block under heavy load. Only the initialization is sync, which would only run once per creating a microservice, everything else is async.
- critical parts
  - when writing file, using the "wx" flag throws error if file exists, with this we avoid race condition between checking if it exists then writing, code is also simpler and faster since we dont overwrite existing files, it would be the same content anyway.
  - writing and updating hashmap isn't atomic. if the app crashes between these, we remain with an orphan corrupt file. There could be a cleanup function that runs every ocne in a while in the background and deletes files that arent stored in the hashmap.

### FS-service.ts
- class that creates api endpoints for the FS class
- this is basically a microservice

### Error-handling
- Only catching file exists error in the FS class, because of the wx flag logic handling, then throwing it again for further handling
- Every error is caught and handled in the service

### Testing
- Created tests for the FS.ts
- No time for the service testing :( Tested it manually sending get and post requests

## CI/CD, cloud environment
Proper functionality would be storing the hashmap in a DB chunk that the microservice handles, and store files in a shared cloud storage for consistency


- Version control system, like git
- CI setup: use a ci/cd service like Jenkins, GitHub Actions
- CI Pipeline: yaml file: build, lint, test
- Automated testing: include the jest test
- Deployment: Use aws azure, or any of the cloud providers
- Security: Implement security best practices like data encryption, access control, vulnerability scanning
- CI/CD Triggers when code is merged to main branch or any relevant branch, automatically deploy.
- Documentation
- Cross-platform compatibility

### More specific process with Docker and Kubernetes
- GitHub Actions: whenever a push comes in, dockerize the content and push it
- Deploy to kubernetes
- Cloud environment: Choose aws azure or gcp with kubernetes support, like Amazon EKS (Elastic Kubernetes Service) or Azure also offers Azure Container Instances (ACI) for serverless container deployment.
- Kubernetes:
  - use kubernetes pods or containers to host the service
  - push docker images to a container registry service
  - set up kubernetes cluster to orchestrate containers
  - configure a load balancer to distribute traffic

Docker is used to build and push images to a registry, while Kubernetes is used to deploy and manage these images in a scalable and reliable way.
This setup ensures consistency and scalability
