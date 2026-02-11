// Node 18+ has global fetch


const BASE_URL = 'http://localhost:65000/api';
const INSTRUCTOR_EMAIL = 'instructor_test_' + Date.now() + '@example.com';
const INSTRUCTOR_PASSWORD = 'password123';

async function run() {
    try {
        // 1. Register Instructor
        console.log(`\n--- 1. Registering Instructor (${INSTRUCTOR_EMAIL}) ---`);
        let res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Instructor',
                email: INSTRUCTOR_EMAIL,
                password: INSTRUCTOR_PASSWORD,
                role: 'instructor'
            })
        });
        let data = await res.json();
        console.log('Register Response:', data);

        if (!data.success) {
            // Try login if already exists (though email is unique with timestamp)
            console.log('Registration failed, trying login...');
        }

        // Login to get token
        console.log(`\n--- 2. Logging In ---`);
        res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: INSTRUCTOR_EMAIL,
                password: INSTRUCTOR_PASSWORD
            })
        });
        data = await res.json();
        console.log('Login Response:', data.success);

        const token = data.data.accessToken;
        if (!token) throw new Error('No access token received');

        // 3. Create Course
        console.log(`\n--- 3. Creating Course ---`);
        res = await fetch(`${BASE_URL}/v1/instructor/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: 'Test Course 101',
                description: 'A test course description',
                thumbnail_url: 'http://example.com/thumb.jpg'
            })
        });
        data = await res.json();
        console.log('Create Course Response:', data);
        const courseId = data.data.id;

        // 4. Create Lesson (Video)
        console.log(`\n--- 4. Creating Video Lesson ---`);
        res = await fetch(`${BASE_URL}/v1/courses/${courseId}/lessons`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: 'Intro Video',
                type: 'video',
                content: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                duration_seconds: 120,
                order_index: 0
            })
        });
        data = await res.json();
        console.log('Create Lesson 1 Response:', data);
        const lesson1Id = data.data.id;

        // 5. Create Lesson (Text)
        console.log(`\n--- 5. Creating Text Lesson ---`);
        res = await fetch(`${BASE_URL}/v1/courses/${courseId}/lessons`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: 'Reading Material',
                type: 'text',
                content: 'Read this important text.',
                order_index: 1
            })
        });
        data = await res.json();
        console.log('Create Lesson 2 Response:', data);
        const lesson2Id = data.data.id;

        // 6. List Lessons
        console.log(`\n--- 6. Listing Lessons ---`);
        res = await fetch(`${BASE_URL}/v1/courses/${courseId}/lessons/manage`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        data = await res.json();
        console.log('Lessons List:', data.success, 'Count:', data.data.length);

        // 7. Update Lesson Order (Swap)
        console.log(`\n--- 7. Swapping Order ---`);
        await fetch(`${BASE_URL}/v1/lessons/${lesson1Id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ order_index: 1 })
        });
        await fetch(`${BASE_URL}/v1/lessons/${lesson2Id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ order_index: 0 })
        });

        // Verify Order
        res = await fetch(`${BASE_URL}/v1/courses/${courseId}/lessons/manage`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        data = await res.json();
        const firstLesson = data.data[0];
        console.log('New First Lesson:', firstLesson.title, '(Index:', firstLesson.order_index, ')');

        if (firstLesson.id === lesson2Id) {
            console.log('SUCCESS: Order swapped correctly.');
        } else {
            console.log('FAILURE: Order did not swap.');
        }

    } catch (error) {
        console.error('Test Failed:', error);
    }
}

run();
