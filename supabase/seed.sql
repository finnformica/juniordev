-- Supabase seed file for local development
-- This file populates the database with sample data for testing UI

-- First, insert users into auth.users table
-- Note: In a real app, users would be created through Supabase Auth, but for seeding we insert directly
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES
-- Business users
('00000000-0000-0000-0000-000000000000', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'authenticated', 'authenticated', 'sarah@techflow.dev', '$2a$10$H3M.U6q4YJZzrDg5dOGQ8u7DvJJv8u4qA3TjKE4xKJLrKM8TmKKYu', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"role":"business","first_name":"Sarah","last_name":"Chen"}', NOW(), NOW(), '', '', '', ''),
('00000000-0000-0000-0000-000000000000', '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 'authenticated', 'authenticated', 'mike@greenleaf.co', '$2a$10$H3M.U6q4YJZzrDg5dOGQ8u7DvJJv8u4qA3TjKE4xKJLrKM8TmKKYu', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"role":"business","first_name":"Mike","last_name":"Rodriguez"}', NOW(), NOW(), '', '', '', ''),
-- Developer users
('00000000-0000-0000-0000-000000000000', '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'authenticated', 'authenticated', 'alex.junior@email.com', '$2a$10$H3M.U6q4YJZzrDg5dOGQ8u7DvJJv8u4qA3TjKE4xKJLrKM8TmKKYu', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"role":"developer","first_name":"Alex","last_name":"Taylor"}', NOW(), NOW(), '', '', '', ''),
('00000000-0000-0000-0000-000000000000', '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', 'authenticated', 'authenticated', 'jordan.dev@email.com', '$2a$10$H3M.U6q4YJZzrDg5dOGQ8u7DvJJv8u4qA3TjKE4xKJLrKM8TmKKYu', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"role":"developer","first_name":"Jordan","last_name":"Kim"}', NOW(), NOW(), '', '', '', ''),
-- Admin user
('00000000-0000-0000-0000-000000000000', '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b', 'authenticated', 'authenticated', 'admin@juniorjobs.com', '$2a$10$H3M.U6q4YJZzrDg5dOGQ8u7DvJJv8u4qA3TjKE4xKJLrKM8TmKKYu', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"role":"admin","first_name":"Admin","last_name":"User"}', NOW(), NOW(), '', '', '', '');

-- Now insert profiles (these will be created automatically by the trigger, but we'll update them with additional data)
-- First, let's manually insert profiles since the trigger might not handle all our custom data
INSERT INTO public.profiles (id, email, role, first_name, last_name, company_name, bio) VALUES
-- Business profiles
('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'sarah@techflow.dev', 'business', 'Sarah', 'Chen', 'TechFlow Solutions', 'Founder of a growing software consultancy specializing in modern web applications. We help small businesses build their digital presence while mentoring the next generation of developers.'),
('2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 'mike@greenleaf.co', 'business', 'Mike', 'Rodriguez', 'GreenLeaf Digital', 'Creative director at a sustainable tech agency. We build digital products that make a positive environmental impact while providing hands-on learning opportunities for junior developers.'),

-- Junior developer profiles
('3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'alex.junior@email.com', 'developer', 'Alex', 'Taylor', NULL, 'Recent bootcamp graduate passionate about frontend development. Eager to contribute to meaningful projects while learning industry best practices.'),
('4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', 'jordan.dev@email.com', 'developer', 'Jordan', 'Kim', NULL, 'Computer science student with a focus on full-stack development. Looking for real-world experience to complement academic learning.'),

-- Admin profile
('5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b', 'admin@juniorjobs.com', 'admin', 'Admin', 'User', NULL, 'Platform administrator')
ON CONFLICT (id) DO UPDATE SET
    company_name = EXCLUDED.company_name,
    bio = EXCLUDED.bio;

-- Update junior profiles with skills and portfolio links
UPDATE public.profiles SET
    skills = ARRAY['React', 'JavaScript', 'HTML', 'CSS', 'Figma'],
    github_url = 'https://github.com/alextaylor',
    portfolio_url = 'https://alextaylor.dev',
    linkedin_url = 'https://linkedin.com/in/alextaylor'
WHERE id = '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f';

UPDATE public.profiles SET
    skills = ARRAY['JavaScript', 'Node.js', 'Python', 'PostgreSQL', 'Docker'],
    github_url = 'https://github.com/jordankim',
    linkedin_url = 'https://linkedin.com/in/jordankim'
WHERE id = '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a';

-- Insert sample jobs for TechFlow Solutions
INSERT INTO public.jobs (
    title,
    company_name,
    description,
    business_id,
    application_email,
    location,
    location_type,
    employment_type,
    experience_level,
    compensation_type,
    compensation_amount,
    skills,
    application_deadline
) VALUES
(
    'Frontend Developer Intern',
    'TechFlow Solutions',
    'Join our team to build responsive React applications for small business clients. You''ll work directly with our senior developers on real projects, learning modern development practices and gaining valuable mentorship.

What you''ll do:
• Build user interfaces with React and TypeScript
• Collaborate with designers on UI/UX implementation
• Write clean, maintainable code
• Participate in code reviews and team meetings

What you''ll learn:
• Modern React patterns and hooks
• TypeScript best practices
• Git workflow and collaboration
• Client communication and project management

Perfect for someone who wants hands-on experience in a supportive environment.',
    '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    'sarah@techflow.dev',
    'Portland, OR',
    'hybrid',
    'internship',
    'entry',
    'unpaid',
    NULL,
    ARRAY['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS'],
    (CURRENT_DATE + INTERVAL '30 days')::date
),
(
    'Full-Stack Developer - Learning Track',
    'TechFlow Solutions',
    'Unique opportunity to work on both frontend and backend development while learning from experienced mentors. This role is designed for someone ready to dive deep into modern web development.

Responsibilities:
• Build REST APIs with Node.js and Express
• Create responsive frontends with React
• Work with PostgreSQL databases
• Deploy applications to cloud platforms

Technologies you''ll use:
• Frontend: React, Next.js, Tailwind CSS
• Backend: Node.js, Express, PostgreSQL
• Tools: Git, Docker, AWS basics
• Testing: Jest, React Testing Library

This is an excellent opportunity to build a strong foundation in full-stack development.',
    '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    'sarah@techflow.dev',
    'Remote',
    'remote',
    'contract',
    'entry',
    'stipend',
    '$800/month',
    ARRAY['React', 'Node.js', 'PostgreSQL', 'JavaScript', 'Express'],
    (CURRENT_DATE + INTERVAL '25 days')::date
),
(
    'UI/UX Developer Assistant',
    'TechFlow Solutions',
    'Perfect role for someone passionate about design and user experience. Work closely with our design team to create beautiful, accessible interfaces that users love.

What you''ll focus on:
• Converting Figma designs to responsive code
• Implementing smooth animations and transitions
• Ensuring accessibility compliance
• Creating reusable component libraries

Skills you''ll develop:
• Advanced CSS and Sass techniques
• Design systems and component libraries
• Accessibility best practices (WCAG)
• Design-to-development workflow

We''re looking for someone with an eye for detail and passion for creating exceptional user experiences.',
    '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    'sarah@techflow.dev',
    'Portland, OR',
    'onsite',
    'part-time',
    'entry',
    'unpaid',
    NULL,
    ARRAY['CSS', 'HTML', 'Figma', 'React', 'Animation'],
    (CURRENT_DATE + INTERVAL '35 days')::date
),
(
    'Backend Developer Apprentice',
    'TechFlow Solutions',
    'Dive deep into server-side development and database design. This role offers comprehensive training in backend technologies with real-world application.

Core responsibilities:
• Design and implement REST APIs
• Optimize database queries and performance
• Implement authentication and security features
• Monitor and debug production applications

Technical stack:
• Languages: JavaScript/Node.js, Python
• Databases: PostgreSQL, Redis
• Cloud: AWS (EC2, RDS, S3)
• Tools: Docker, GitHub Actions

Ideal for someone who enjoys problem-solving and wants to understand how applications work under the hood.',
    '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    'sarah@techflow.dev',
    'Portland, OR',
    'hybrid',
    'internship',
    'entry',
    'unpaid',
    NULL,
    ARRAY['Node.js', 'PostgreSQL', 'Python', 'REST APIs', 'AWS'],
    (CURRENT_DATE + INTERVAL '40 days')::date
);

-- Insert sample jobs for GreenLeaf Digital
INSERT INTO public.jobs (
    title,
    company_name,
    description,
    business_id,
    application_email,
    location,
    location_type,
    employment_type,
    experience_level,
    compensation_type,
    compensation_amount,
    skills,
    application_deadline
) VALUES
(
    'Sustainable Web Developer',
    'GreenLeaf Digital',
    'Join our mission to create eco-friendly digital solutions! We''re looking for a junior developer who cares about environmental impact and wants to build websites that are both beautiful and sustainable.

Projects you''ll work on:
• Carbon-neutral websites for green businesses
• Environmental impact tracking applications
• Renewable energy company websites
• Sustainable e-commerce platforms

Sustainability practices you''ll learn:
• Optimizing code for energy efficiency
• Green hosting and deployment strategies
• Measuring and reducing digital carbon footprint
• Accessible design that works on older devices

Perfect for someone passionate about both technology and environmental responsibility.',
    '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    'mike@greenleaf.co',
    'San Francisco, CA',
    'hybrid',
    'internship',
    'entry',
    'stipend',
    '$600/month',
    ARRAY['HTML', 'CSS', 'JavaScript', 'React', 'Performance Optimization'],
    (CURRENT_DATE + INTERVAL '28 days')::date
),
(
    'Green Tech Full-Stack Developer',
    'GreenLeaf Digital',
    'Build full-stack applications that make a positive environmental impact. Work on exciting projects for clean energy companies, sustainable agriculture, and environmental monitoring.

Technical focus areas:
• IoT applications for environmental monitoring
• Data visualization for sustainability metrics
• Mobile apps for eco-conscious consumers
• Integration with renewable energy APIs

Tech stack:
• Frontend: React, Vue.js, D3.js for data visualization
• Backend: Node.js, Python, Django
• Databases: PostgreSQL, InfluxDB for time-series data
• Cloud: Google Cloud Platform (carbon-neutral hosting)

You''ll learn how technology can be a force for environmental good while building strong technical skills.',
    '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    'mike@greenleaf.co',
    'Remote',
    'remote',
    'contract',
    'entry',
    'stipend',
    '$1000/month',
    ARRAY['React', 'Node.js', 'Python', 'Data Visualization', 'IoT'],
    (CURRENT_DATE + INTERVAL '32 days')::date
),
(
    'Environmental Data Analyst & Developer',
    'GreenLeaf Digital',
    'Unique hybrid role combining data analysis with web development. Help environmental organizations make data-driven decisions through beautiful, interactive dashboards and reports.

Key responsibilities:
• Analyze environmental datasets and trends
• Build interactive data visualization dashboards
• Create automated reporting systems
• Develop APIs for environmental data access

Skills you''ll develop:
• Data analysis with Python and R
• Interactive visualizations with D3.js and Chart.js
• Database design for environmental data
• GIS and mapping technologies

Ideal for someone interested in both programming and environmental science.',
    '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    'mike@greenleaf.co',
    'San Francisco, CA',
    'hybrid',
    'contract',
    'entry',
    'unpaid',
    NULL,
    ARRAY['Python', 'Data Analysis', 'JavaScript', 'D3.js', 'GIS'],
    (CURRENT_DATE + INTERVAL '45 days')::date
),
(
    'Mobile App Developer - Climate Action',
    'GreenLeaf Digital',
    'Build mobile applications that help people reduce their environmental footprint. Work on apps for carbon tracking, sustainable lifestyle choices, and environmental community building.

App projects:
• Personal carbon footprint calculator
• Sustainable product recommendation app
• Local environmental action organizing platform
• Green energy usage tracking dashboard

Technical skills:
• React Native for cross-platform development
• Integration with environmental data APIs
• User authentication and data privacy
• Push notifications and offline functionality

Learning opportunities:
• Mobile app design and user experience
• Environmental data sources and APIs
• Privacy-first development practices
• App store optimization and distribution

Great for someone excited about mobile development and environmental activism.',
    '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    'mike@greenleaf.co',
    'San Francisco, CA',
    'onsite',
    'part-time',
    'entry',
    'unpaid',
    NULL,
    ARRAY['React Native', 'Mobile Development', 'JavaScript', 'API Integration', 'UX Design'],
    (CURRENT_DATE + INTERVAL '38 days')::date
),
(
    'DevOps & Sustainability Engineer',
    'GreenLeaf Digital',
    'Learn DevOps practices while focusing on sustainable and efficient infrastructure. Help us build and maintain carbon-neutral development and deployment pipelines.

Responsibilities:
• Set up CI/CD pipelines with environmental monitoring
• Optimize server infrastructure for energy efficiency
• Implement monitoring and alerting systems
• Automate deployment to green cloud providers

Technologies you''ll learn:
• Docker and Kubernetes for containerization
• GitHub Actions for CI/CD automation
• Monitoring tools (Grafana, Prometheus)
• Green cloud providers and carbon monitoring

Sustainability focus:
• Measuring and reducing infrastructure carbon footprint
• Optimizing resource usage and costs
• Implementing efficient caching and CDN strategies
• Green hosting and renewable energy integration

Perfect opportunity to learn DevOps while making a positive environmental impact.',
    '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    'mike@greenleaf.co',
    'Remote',
    'remote',
    'internship',
    'entry',
    'stipend',
    '$700/month',
    ARRAY['DevOps', 'Docker', 'CI/CD', 'Linux', 'Monitoring'],
    (CURRENT_DATE + INTERVAL '42 days')::date
);