# SnapShare Photo App Scaling Plan

## 1. Introduction

SnapShare is a photo-sharing application where users upload photos and view photos shared by people they follow.

As the application grows, it must handle large numbers of photo uploads and feed requests while maintaining good performance and reliability.

This document estimates the system's capacity requirements and proposes a scalable architecture for storing photos, processing thumbnails, and delivering feeds to users.

## 2. Assumptions

The following assumptions are used for capacity planning:

- Total registered users: 10,000,000.
- Daily active users (DAU): 10% of registered users.
- Each daily active user uploads 1 photo per day.
- Each daily active user views 50 feed pages per day.
- Each original photo is 2 MB.
- Each thumbnail is 50 KB.
- Each uploaded photo produces one thumbnail.
- The system operates 365 days per year.
- Peak traffic is estimated at five times the average traffic.
- Each feed page view is treated as one feed request.
- All uploaded photos and thumbnails are retained for one year.
- Storage calculations exclude database overhead, backups, replicas, and temporary files.

## 3. Capacity Planning and Calculations

### 3.1 Daily Active Users

DAU = 10,000,000 × 10%

DAU = 1,000,000 users

### 3.2 Photo Uploads Per Day

Daily uploads = 1,000,000 × 1

Daily uploads = 1,000,000 photos

### 3.3 Average Uploads Per Second

Seconds per day = 24 × 60 × 60 = 86,400

Average uploads per second = 1,000,000 / 86,400

Average uploads per second ≈ 11.57

### 3.4 Peak Uploads Per Second

Peak uploads per second = 11.57 × 5

Peak uploads per second ≈ 57.87

The system should accommodate approximately 58 uploads per second during peak periods.

### 3.5 Feed Views Per Day

Daily feed views = 1,000,000 × 50

Daily feed views = 50,000,000 feed requests

### 3.6 Average Feed Views Per Second

Average feed requests per second = 50,000,000 / 86,400

Average feed requests per second ≈ 578.70

### 3.7 Peak Feed Views Per Second

Peak feed requests per second = 578.70 × 5

Peak feed requests per second ≈ 2,893.52

The system should accommodate approximately 2,894 feed requests per second during peak periods.

These figures represent feed requests, not individual image downloads. Each feed page may contain several photos.

### 3.8 Read-to-Write Ratio

Daily feed views = 50,000,000

Daily uploads = 1,000,000

Read-to-write ratio = 50,000,000 / 1,000,000

Read-to-write ratio = 50:1

SnapShare is a read-heavy application because feed requests occur approximately 50 times as frequently as photo uploads.

Caching, a CDN, and database read replicas help reduce latency and prevent the primary database from becoming overloaded.

### 3.9 Original Photo Storage Per Day

Daily original storage = 1,000,000 × 2 MB

Daily original storage = 2 TB

### 3.10 Thumbnail Storage Per Day

Daily thumbnail storage = 1,000,000 × 50 KB

Daily thumbnail storage = 50 GB

### 3.11 Annual Storage Requirements

Annual original storage = 2 TB × 365

Annual original storage = 730 TB

Annual thumbnail storage = 50 GB × 365

Annual thumbnail storage = 18.25 TB

Total annual storage = 730 TB + 18.25 TB

Total annual storage = 748.25 TB

SnapShare therefore requires approximately 748.25 TB of additional storage for one year's original photos and thumbnails.

This estimate uses decimal units and assumes every photo and thumbnail is retained for one year.

### 3.12 Capacity Planning Summary

| Metric                 | Average or Daily Estimate | Peak or Annual Estimate |
| ---------------------- | ------------------------: | ----------------------: |
| Registered users       |                10,000,000 |              10,000,000 |
| Daily active users     |                 1,000,000 |               1,000,000 |
| Photo uploads          |             1,000,000/day |       58 uploads/second |
| Feed requests          |            50,000,000/day |   2,894 requests/second |
| Original photo storage |                  2 TB/day |             730 TB/year |
| Thumbnail storage      |                 50 GB/day |           18.25 TB/year |
| Combined storage       |               2.05 TB/day |          748.25 TB/year |
| Read-to-write ratio    |                      50:1 |     Read-heavy workload |

Peak estimates assume traffic reaches five times the average rate. Load testing is required to confirm the capacity needed by each component.

## 4. Proposed System Architecture

The architecture separates application processing, metadata storage, image storage, caching, and background thumbnail generation.

### 4.1 Architecture Diagram

```text
                  +----------------------+
                  |    Mobile / Web      |
                  |       Clients        |
                  +----------+-----------+
                             |
                  +----------v-----------+
                  |          CDN         |
                  | Cached Images/Files  |
                  +----------+-----------+
                             |
                  +----------v-----------+
                  |    Load Balancer     |
                  +----------+-----------+
                             |
              +--------------+--------------+
              |              |              |
       +------v------+ +-----v-------+ +----v---------+
       | Application | | Application | | Application  |
       | Server 1    | | Server 2     | | Server N     |
       +------+------+ +------+------+ +------+-------+
              |               |               |
              +---------------+---------------+
                              |
                  +-----------+-----------+
                  |                       |
            +-----v------+         +------v---------+
            | Cache      |         | Primary        |
            | Feed Data  |         | Database       |
            +------------+         +------+---------+
                                          |
                                   +------v---------+
                                   | Database Read   |
                                   | Replicas        |
                                   +-----------------+

             ASYNCHRONOUS PHOTO PROCESSING

                Application Servers
                         |
              +----------+----------+
              |                     |
       +------v-------+      +------v-------+
       | Object       |      | Message      |
       | Storage      |      | Queue        |
       | Original     |      | Thumbnail Job|
       +------+-------+      +------+-------+
              |                     |
              |              +------v-------+
              |              | Background   |
              |              | Thumbnail    |
              |              | Workers      |
              |              +------+-------+
              |                     |
              +---------------------+
                         |
                  +------v-------+
                  | Object       |
                  | Storage      |
                  | Thumbnails   |
                  +--------------+
                  Component Descriptions

Mobile and Web Clients

Clients allow users to upload photos, browse feeds, and view images. They communicate with the application using HTTPS.

Content Delivery Network (CDN)

The CDN caches and delivers images from locations closer to users. It reduces latency, bandwidth consumption, and repeated requests to object storage. Private images require appropriate access controls.

Load Balancer

The load balancer distributes incoming requests among healthy application servers. It performs health checks and prevents one server from handling all traffic.

Application Servers

Application servers authenticate users, validate uploads, handle feed requests, manage metadata, and coordinate communication with the database, cache, object storage, and message queue.

Cache

The cache stores frequently requested feed results and metadata. It reduces repeated database queries and improves response times. Cache expiration and invalidation policies help maintain data freshness.

Primary Database

The primary database stores structured information such as user records, photo metadata, upload timestamps, visibility settings, and image references. It handles writes and maintains the authoritative data.

Database Read Replicas

Read replicas serve suitable read queries, reducing the load on the primary database. Replication delays must be considered when recently updated information is requested.

Object Storage

Object storage holds original photos and generated thumbnails. The database stores references to the images instead of storing large binary files directly.

Message Queue

The message queue holds thumbnail-generation jobs until background workers process them. It separates upload requests from image-processing tasks and helps absorb temporary traffic spikes.

Background Thumbnail Workers

Workers retrieve jobs from the queue, read original images, generate thumbnails, store the results in object storage, and update processing status. Workers can scale independently as the queue grows.

5. Step-by-Step Photo Upload Workflow
A user selects a photo and submits an upload request over HTTPS.
The load balancer forwards the request to a healthy application server.
The application server authenticates the user and validates the file type, file size, and upload permissions.
The application server writes the original photo to object storage using a unique object key.
The application server records the photo metadata in the primary database, including the uploader, object key, upload time, visibility settings, and processing status.
The application server adds a thumbnail-generation job to the message queue. The job contains the photo identifier and original object's key.
Once the original image and metadata are stored successfully and the job has been accepted by the queue, the server returns an upload-success response. The response can indicate that thumbnail processing is pending.
A background worker retrieves the thumbnail job from the queue.
The worker reads the original image from object storage, validates it, resizes it, and generates a thumbnail.
The worker saves the thumbnail to object storage under a separate object key.
The worker updates the photo metadata to indicate that thumbnail processing is complete.
The CDN serves the thumbnail when requested, retrieving it from the authorized origin if it is not already cached.
If thumbnail generation fails, the system retries the job according to a retry policy. Repeated failures are recorded for investigation.

This asynchronous workflow allows uploads to complete without making users wait for thumbnail generation.

The system must also handle partial failures, such as an image being stored successfully while a database or queue operation fails. Retry, reconciliation, and cleanup procedures help prevent orphaned files and permanently pending jobs.

6. Step-by-Step Feed Viewing Workflow
A user opens the SnapShare feed.
The load balancer forwards the request to an application server.
The application server authenticates the user and checks the cache for a valid feed result.
If the feed is cached, the server uses the cached result.
If the feed is not cached, the server retrieves the necessary metadata from a suitable database read replica or the primary database when stronger consistency is required.
The application server returns feed metadata and image references to the client.
The client requests the images through the CDN.
The CDN serves cached images or retrieves missing images from the authorized origin.
The client displays the feed.

This design allows feed metadata requests and image delivery to scale independently.

7. Scaling Strategy
7.1 Horizontal Application Scaling

Additional application servers can be added behind the load balancer as traffic increases. Stateless servers simplify scaling and replacement of failed instances.

7.2 Cache Optimization

Frequently requested feed results and metadata should be cached where appropriate. Cache hit rates, expiration, and invalidation must be monitored to balance performance and freshness.

7.3 Database Scaling

Read replicas handle suitable read-heavy queries, reducing pressure on the primary database. Indexes should support frequently used query patterns, and slow queries should be optimized.

7.4 Asynchronous Image Processing

Background workers generate thumbnails independently of the upload request. Worker capacity can increase when queue depth or processing time rises.

7.5 Object Storage and CDN Scaling

Object storage grows independently of the database. The CDN reduces repeated origin requests and improves image delivery for geographically distributed users.

7.6 Monitoring and Reliability

The system should monitor:

Upload success and failure rates.
Request latency.
Application server CPU and memory usage.
Database query latency and connection usage.
Cache hit and miss rates.
Database replication lag.
Message queue depth and oldest job age.
Thumbnail-processing failures.
Object storage errors and capacity.
CDN cache hit rates and origin traffic.

Alerts should identify sustained failures, growing queues, high latency, and resource saturation.

Load tests should verify whether the system can support approximately 58 uploads per second and 2,894 feed requests per second under the assumed peak conditions.

8. Architecture Trade-Offs
Trade-Off 1: CDN and Cache Versus Data Freshness

A CDN and application cache improve response times and reduce database and object-storage load. This is particularly valuable because SnapShare has a 50:1 read-to-write ratio.

However, cached data may become stale when users upload photos, change visibility settings, or delete content.

The system needs appropriate cache expiration, invalidation, and authorization policies. Private or deleted content must not remain accessible through improperly configured caches.

The trade-off is between faster responses and the complexity of maintaining sufficiently fresh and secure cached information.

Trade-Off 2: Asynchronous Processing Versus Immediate Availability

A message queue and background workers allow uploads to finish without waiting for thumbnail generation. This improves upload responsiveness and allows processing capacity to scale independently.

However, thumbnails may not be available immediately. Queues also introduce operational complexity, including retries, duplicate messages, monitoring, and failure recovery.

The system should display a pending-processing status when necessary and make thumbnail jobs safe to retry.

The trade-off is between responsive uploads and the immediate availability of every derived image.

9. Conclusion

SnapShare is a read-heavy photo-sharing application with approximately one million daily active users, one million daily uploads, and fifty million daily feed requests.

Under the stated assumptions, peak traffic reaches approximately 58 uploads per second and 2,894 feed requests per second. Original photos and thumbnails require approximately 748.25 TB of additional storage for one year's uploads.

A scalable solution combines a CDN, load balancer, application servers, caching, a primary database with read replicas, object storage, a durable message queue, and background thumbnail workers.

Separating image storage from metadata storage and processing thumbnails asynchronously helps SnapShare handle increasing traffic while maintaining responsive uploads and efficient feed delivery.
```
