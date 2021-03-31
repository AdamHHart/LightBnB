INSERT INTO users (name, email, password)
VALUES ('Adam Hart', 'adamhayhart@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Dom Hart', 'domstromm@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Charlie Hart', 'chuckBorris@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Bia Caixeta', 'biabiabia@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');


INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1 , 'Lovely Shoebox', 'description', 'https://thejesuitpost.org/wordpress/wp-content/uploads/2012/08/Art-House-Near-Michigan-Central-Station-by-Benjamin-Lyons-at-Flickr.jpg', 'https://thejesuitpost.org/wordpress/wp-content/uploads/2012/08/Art-House-Near-Michigan-Central-Station-by-Benjamin-Lyons-at-Flickr.jpg', 12099, 3, 3, 3, 'Canada', 'Pender', 'Vancouver', 'BC', 'V5L 4L3', TRUE),
(2 , 'Chicken Coop', 'description', 'https://thejesuitpost.org/wordpress/wp-content/uploads/2012/08/Art-House-Near-Michigan-Central-Station-by-Benjamin-Lyons-at-Flickr.jpg', 'https://thejesuitpost.org/wordpress/wp-content/uploads/2012/08/Art-House-Near-Michigan-Central-Station-by-Benjamin-Lyons-at-Flickr.jpg', 14099, 1, 1, 0, 'Canada', 'Water', 'Vancouver', 'BC', 'V5M 4J3', TRUE),
(3 , 'Shared Dorm Room', 'description', 'https://thejesuitpost.org/wordpress/wp-content/uploads/2012/08/Art-House-Near-Michigan-Central-Station-by-Benjamin-Lyons-at-Flickr.jpg', 'https://thejesuitpost.org/wordpress/wp-content/uploads/2012/08/Art-House-Near-Michigan-Central-Station-by-Benjamin-Lyons-at-Flickr.jpg', 11099, 1, 0, 2, 'Canada', 'Marine', 'Vancouver', 'BC', 'V5L 4N3', TRUE),
(4 , 'Frat House', 'description', 'https://thejesuitpost.org/wordpress/wp-content/uploads/2012/08/Art-House-Near-Michigan-Central-Station-by-Benjamin-Lyons-at-Flickr.jpg', 'https://thejesuitpost.org/wordpress/wp-content/uploads/2012/08/Art-House-Near-Michigan-Central-Station-by-Benjamin-Lyons-at-Flickr.jpg', 12099, 5, 2, 11, 'Canada', 'Beach', 'Vancouver', 'BC', 'V5W 4R3', TRUE);


INSERT INTO reservations (guest_id, property_id, start_date, end_date) 
VALUES (1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) 
VALUES (1, 1, 1, 1, 'messages'),
(2, 2, 2, 2, 'messages'),
(3, 3, 3, 2, 'messages');