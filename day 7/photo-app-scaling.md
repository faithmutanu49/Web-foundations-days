# SnapShare Photo App Scaling Plan

## 1. Assumptions and Estimates

SnapShare is a photo-sharing application where users upload photos and view a feed containing photos from people they follow.

### Given Information

- Registered users: 10,000,000
- Daily active users: 10% of registered users
- Photos uploaded per active user per day: 1
- Feed pages viewed per active user per day: 50
- Average original photo size: 2 MB
- Average thumbnail size: 50 KB
- Peak traffic factor: 5 times the average traffic
- Time period: 365 days per year

### Assumptions

1. Ten percent of registered users use SnapShare every day.
2. Every daily active user uploads exactly one photo per day.
3. Every daily active user views 50 feed pages per day.
4. Each uploaded photo produces one thumbnail.
5. Each feed page request counts as one feed view, regardless of the number of photos displayed.
6. Traffic is averaged across 24 hours per day and 365 days per year.
7. Peak traffic is five times the average traffic.
8. Every uploaded photo and thumbnail is retained for one year, with no deletions or compression beyond the stated file sizes.
9. For storage estimates, 1 MB = 1,000 KB and 1 GB = 1,000 MB.
10. The calculations exclude database records, backups, replicas, logs, and other storage overhead unless stated otherwise.

### Calculate Daily Active Users

Daily active users = Registered users × Daily active percentage

= 10,000,000 × 10%

= **1,000,000 daily active users**

Therefore, SnapShare has an estimated one million daily active users.

### Calculate Uploads Per Second

Each daily active user uploads one photo per day.

Daily uploads = 1,000,000 × 1

= 1,000,000 photos per day

Average uploads per second = Daily uploads ÷ 86,400 seconds

= 1,000,000 ÷ 86,400

= **11.57 uploads per second**

Peak uploads per second = 11.57 × 5

= **57.87 uploads per second**

The system should therefore be designed to handle approximately 58 photo uploads per second during peak traffic, with additional capacity for unexpected spikes.

### Calculate Feed Views Per Second

Each daily active user views 50 feed pages per day.

Daily feed views = 1,000,000 × 50

= 50,000,000 feed views per day

Average feed views per second = 50,000,000 ÷ 86,400

= **578.70 feed views per second**

Peak feed views per second = 578.70 × 5

= **2,893.52 feed views per second**

The application should therefore handle approximately 2,894 feed views per second during peak traffic.

### Calculate Photo Storage Per Year

Each original photo occupies 2 MB, and each thumbnail occupies 50 KB.

Convert the thumbnail size to MB:

50 KB ÷ 1,000 = 0.05 MB

Total storage per uploaded photo:

2 MB + 0.05 MB = 2.05 MB

Daily original photo storage:

1,000,000 × 2 MB = 2,000,000 MB

= 2,000 GB

= **2 TB per day**

Daily thumbnail storage:

1,000,000 × 0.05 MB = 50,000 MB

= 50 GB per day

Total daily photo storage:

2 TB + 50 GB = **2.05 TB per day**

Annual original photo storage:

2,000,000 MB × 365 = 730,000,000 MB

= 730,000 GB

= **730 TB per year**

Annual thumbnail storage:

50,000 MB × 365 = 18,250,000 MB

= 18,250 GB

= **18.25 TB per year**

Total annual photo storage:

730 TB + 18.25 TB = **748.25 TB per year**

This estimate assumes decimal storage units and excludes database records, backups, replication, and storage overhead.

### Summary of Estimates

| Metric                 | Daily Estimate | Average Per Second | Peak Per Second |
| ---------------------- | -------------: | -----------------: | --------------: |
| Daily active users     |      1,000,000 |                  — |               — |
| Photo uploads          |      1,000,000 |              11.57 |           57.87 |
| Feed views             |     50,000,000 |             578.70 |        2,893.52 |
| Original photo storage |           2 TB |                  — |               — |
| Thumbnail storage      |          50 GB |                  — |               — |
| Total photo storage    |        2.05 TB |                  — |               — |

**Estimated annual photo storage: 748.25 TB**, consisting of 730 TB of original photos and 18.25 TB of thumbnails.

## 2. Is SnapShare Read-Heavy or Write-Heavy?

SnapShare is a **read-heavy system** because users view approximately 50 million feed pages per day but upload only one million photos per day.

The ratio of feed views to photo uploads is:

50,000,000 ÷ 1,000,000 = **50:1**

This means that SnapShare receives approximately 50 feed views for every photo uploaded.

The design should therefore prioritize fast reads by using a content delivery network (CDN), caching frequently requested data, database read replicas, and horizontally scalable application servers.

Photo uploads must still be reliable, but read performance is the main priority because feed traffic is much higher than upload traffic.

## 3. Why Photos Should Not Be Stored Inside the Database

Photos should not be stored directly inside the main relational database because they are large binary files that would significantly increase database storage requirements, backups, and recovery times.

Storing large files in the database can also increase database costs and compete with queries for user profiles, captions, comments, and other structured information.

Instead, original photos and thumbnails should be stored in **object storage**, such as Amazon S3, Google Cloud Storage, or an equivalent object storage service.

The database should store the photo metadata, including the photo ID, user ID, caption, upload time, and object storage key or URL.

This separation allows object storage to scale independently while the database efficiently manages structured information.

A CDN can cache and deliver the stored photos and thumbnails from locations closer to users, reducing latency and the load on the origin storage.

## 4. SnapShare Architecture Diagram

```text
                         USERS
                           |
              +------------+------------+
              |                         |
              v                         v
       +-------------+           +-------------+
       |    CDN      |           | Load        |
       | Photo and   |           | Balancer    |
       | Thumbnail   |           +-------------+
       | Delivery    |                  |
       +-------------+                  v
              |                  +---------------+
              |                  | App Servers   |
              |                  | (Horizontally |
              |                  | Scalable)     |
              |                  +---------------+
              |                    /     |      \
              |                   /      |       \
              |                  v       v        v
              |             +-------+ +--------+ +----------------+
              |             | Cache | | Queue  | | Primary        |
              |             |       | |        | | Database       |
              |             +-------+ +--------+ +----------------+
              |                         |                |
              |                         v                v
              |                  +--------------+  +----------------+
              |                  | Thumbnail    |  | Read Replica  |
              |                  | Worker       |  | Database      |
              |                  +--------------+  +----------------+
              |                         |
              |                         v
              |                  +----------------+
              +----------------->| Object Storage |
                                 | Original Photos|
                                 | + Thumbnails   |
                                 +----------------+
```

**Diagram note:** The diagram shows the major components and their relationships. In a production deployment, application servers upload original photos to object storage, workers generate thumbnails, and the CDN retrieves and caches the resulting files. The load balancer directs application requests to available app servers, while database writes go to the primary database and suitable reads can go to the read replica.

## 5. Components and the Problems They Solve

1. **Users:** Users upload photos and request feeds, creating the application's read and write traffic.

2. **CDN:** A content delivery network caches and delivers photos and thumbnails from geographically distributed locations, reducing latency and origin storage traffic.

3. **Load balancer:** The load balancer distributes incoming application requests across healthy app servers to prevent any single server from becoming overloaded.

4. **App servers:** Application servers handle authentication, photo upload requests, feed generation, metadata operations, and communication with other services.

5. **Cache:** The cache stores frequently requested information, such as popular feed data and photo metadata, reducing repeated database queries and improving response times.

6. **Primary database:** The primary database stores structured information such as user accounts, relationships, captions, photo metadata, and feed-related records while handling writes.

7. **Read replica:** The read replica serves suitable read queries, reducing the workload on the primary database and improving read scalability.

8. **Queue:** The queue stores thumbnail-generation jobs so that photo uploads do not have to wait for image processing to finish.

9. **Thumbnail worker:** The worker consumes queued jobs, generates thumbnails from original photos, and saves the resulting files to object storage.

10. **Object storage:** Object storage holds the original photos and generated thumbnails durably and independently of the application database.

## 6. Photo Upload Flow

1. A user signs in and selects a photo to upload through the SnapShare application.

2. The app server authenticates the user and validates the request, including the file type, file size, and applicable upload limits.

3. The application generates a unique photo ID and determines an object storage key for the original photo.

4. The original photo is uploaded to object storage. The application may use a short-lived, pre-signed upload URL to allow the client to upload directly to object storage, reducing traffic through the app servers.

5. Once the original photo has been uploaded successfully, the application records its metadata in the primary database, including the photo ID, user ID, caption, upload time, and object storage key.

6. The application publishes a thumbnail-generation job to the queue, containing the photo ID and the location of the original photo.

7. The application confirms the successful upload to the user once the required upload and metadata operations have succeeded and the thumbnail job has been safely queued.

8. A thumbnail worker retrieves the job from the queue and downloads or reads the original photo from object storage.

9. The worker resizes the original photo to create a thumbnail with a target size of approximately 50 KB. The actual size may vary depending on the image and compression settings.

10. The worker saves the thumbnail in object storage under its own key and updates the database with the thumbnail location and processing status.

11. The CDN retrieves and caches the thumbnail when requested, allowing it to be delivered efficiently to users viewing their feeds.

12. The queue and worker system retries failed jobs and records persistent failures for investigation, preventing temporary processing problems from silently losing thumbnail-generation tasks.

## 7. Trade-Offs

### Trade-Off 1: Caching Versus Data Freshness

Caching feed data and metadata improves response times and reduces database load. However, cached information may become outdated when a user uploads a new photo, changes a caption, or deletes content.

**Decision:** Use a suitable cache expiration period and invalidate or update relevant cache entries when important changes occur. This balances performance with data freshness.

### Trade-Off 2: Asynchronous Thumbnail Generation Versus Immediate Availability

Using a queue and background worker allows the application to confirm an upload without waiting for thumbnail processing to finish. However, the thumbnail may not be available immediately after the original photo is uploaded.

**Decision:** Accept a short delay in thumbnail availability, show a temporary placeholder when necessary, and use reliable job retries to ensure eventual processing.

### Trade-Off 3: Read Replicas Versus Strongly Consistent Reads

Read replicas distribute query traffic and improve read scalability. However, replication lag can cause users to temporarily see outdated information, such as a newly uploaded photo missing from a feed.

**Decision:** Route ordinary feed reads to read replicas where appropriate, but use the primary database for operations that require immediate consistency. The application can also use optimistic updates or temporary feed entries after an upload.

### Trade-Off 4: Direct-to-Object-Storage Uploads Versus Application-Controlled Uploads

Direct uploads reduce app server bandwidth and allow large files to be transferred efficiently. However, they require secure pre-signed URLs, careful validation, and verification that an upload completed before metadata is finalized.

**Decision:** Use short-lived, restricted pre-signed URLs and verify the uploaded object before marking the photo as successfully processed.

## 8. Conclusion

SnapShare is a read-heavy photo-sharing application with an estimated one million daily active users, approximately 11.57 photo uploads per second on average, and approximately 578.70 feed views per second on average.

Using a peak traffic factor of five, the system should accommodate approximately 58 uploads per second and 2,894 feed views per second.

The application is expected to generate approximately 748.25 TB of new photo and thumbnail data annually. A scalable architecture using a CDN, load balancer, horizontally scalable app servers, cache, primary database, read replica, object storage, and an asynchronous thumbnail queue and worker can support these demands while balancing performance, reliability, consistency, and cost.
