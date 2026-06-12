import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../utils/supabaseClient';

const GOOGLE_MAPS_LINK = 'https://share.google/5NUOxchrn5LyhEvE4';

const DEFAULT_REVIEWS = [
  {
    id: 'rev_1',
    name: 'Karthik Raja (Interior Architect)',
    rating: 5,
    comment: 'Best quality sliding fittings and profile sections in Chennai. We use SFIT fittings for all our premium modular kitchen projects. Extremely durable.',
    date: '2 weeks ago',
    source: 'Google'
  },
  {
    id: 'rev_2',
    name: 'Meera Krishnan',
    rating: 5,
    comment: 'Purchased the Universal Magic Corner and S Corner for my kitchen. The soft close mechanism is super smooth and build quality is top-notch. Highly recommended B2B hardware dealer.',
    date: '1 month ago',
    source: 'Google'
  },
  {
    id: 'rev_3',
    name: 'Senthil Kumar (SK Builders)',
    rating: 5,
    comment: 'Excellent pricing for trade buyers. The team is very responsive on WhatsApp. Quick delivery and exact fittings as described. Best hardware supplier in Tamil Nadu.',
    date: '3 weeks ago',
    source: 'Google'
  }
];

const Reviews = () => {
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const sectionRef = useRef(null);

  // Fetch reviews from Supabase with LocalStorage fallback
  useEffect(() => {
    const fetchReviews = async () => {
      let dbReviews = [];
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (!error && data) {
            dbReviews = data.map(r => ({
              id: r.id,
              name: r.name,
              rating: r.rating,
              comment: r.comment,
              date: 'Just now',
              source: 'Website'
            }));
          }
        } catch (e) {
          console.log("No reviews table in Supabase, falling back to LocalStorage.");
        }
      }

      // Load from LocalStorage
      const localReviews = JSON.parse(localStorage.getItem('sfit_local_reviews') || '[]');
      
      // Combine reviews
      setReviews([...localReviews, ...dbReviews, ...DEFAULT_REVIEWS]);
    };

    fetchReviews();
  }, []);

  // Intersection observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.section-reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [reviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    const newReview = {
      id: `local_${Date.now()}`,
      name,
      rating,
      comment,
      date: 'Just now',
      source: 'Website'
    };

    let savedToCloud = false;

    // Try saving to Supabase
    if (supabase) {
      try {
        const { error } = await supabase.from('reviews').insert([{
          name,
          rating,
          comment
        }]);
        if (!error) {
          savedToCloud = true;
        }
      } catch (e) {
        console.error("Failed to write to Supabase reviews table:", e);
      }
    }

    // Fallback/additional local save
    if (!savedToCloud) {
      const localReviews = JSON.parse(localStorage.getItem('sfit_local_reviews') || '[]');
      const updated = [newReview, ...localReviews];
      localStorage.setItem('sfit_local_reviews', JSON.stringify(updated));
    }

    // Update state
    setReviews(prev => [newReview, ...prev]);
    setName('');
    setComment('');
    setRating(5);
    setIsSubmitting(false);
    setSubmitSuccess(true);

    // Prompt user to also copy to Google Reviews
    setTimeout(() => {
      if (window.confirm("Thank you for your feedback! Would you also like to post this review directly to our official Google page?")) {
        window.open(GOOGLE_MAPS_LINK, '_blank');
      }
      setSubmitSuccess(false);
    }, 1500);
  };

  return (
    <section id="reviews" ref={sectionRef} className="relative py-24 bg-white border-y border-slate-200/80 overflow-hidden">
      <div className="blueprint-grid opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 section-reveal">
          <span className="text-accent-blue text-xs font-mono tracking-[0.3em] uppercase">Testimonials</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-slate-900 mt-3">
            Customer Reviews
          </h2>
          <div className="w-16 h-[2px] bg-accent-blue mx-auto mt-6" />
        </div>

        {/* Top Google Review Status Card */}
        <div className="section-reveal max-w-3xl mx-auto mb-16 bg-slate-50 border border-slate-200/80 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-200 transition-all duration-300 shadow-sm">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 border border-slate-200">
              <svg className="w-10 h-10 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V13.4h6.887c-.648 2.41-2.519 4.03-5.136 4.03-3.052 0-5.542-2.433-5.542-5.43s2.49-5.43 5.542-5.43c1.358 0 2.614.486 3.603 1.286l2.42-2.323C18.473 3.973 15.532 3 12.24 3 7.14 3 3 7.03 3 12s4.14 9 9.24 9c5.34 0 8.87-3.643 8.87-8.785 0-.62-.068-1.2-.177-1.714H12.24z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-1 mb-1">
                {[...Array(4)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
                {/* 4.6 rating partial star */}
                <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <defs>
                    <linearGradient id="half-star-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="60%" stopColor="#f59e0b" />
                      <stop offset="60%" stopColor="#cbd5e1" />
                    </linearGradient>
                  </defs>
                  <path fill="url(#half-star-grad)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span className="text-slate-800 font-semibold text-lg ml-2 font-mono">4.6</span>
              </div>
              <h3 className="text-slate-800 font-semibold text-lg">Official Google Rating</h3>
              <p className="text-slate-500 text-xs font-mono">Precision Hardware & Fittings Reviews</p>
            </div>
          </div>
          <a
            href={GOOGLE_MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V13.4h6.887c-.648 2.41-2.519 4.03-5.136 4.03-3.052 0-5.542-2.433-5.542-5.43s2.49-5.43 5.542-5.43c1.358 0 2.614.486 3.603 1.286l2.42-2.323C18.473 3.973 15.532 3 12.24 3 7.14 3 3 7.03 3 12s4.14 9 9.24 9c5.34 0 8.87-3.643 8.87-8.785 0-.62-.068-1.2-.177-1.714H12.24z"/>
            </svg>
            Write a Google Review
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Reviews Grid */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-slate-800 font-display text-xl mb-4 section-reveal">Recent Testimonials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {reviews.map((review, idx) => (
                <div
                  key={review.id}
                  className="section-reveal bg-slate-50 border border-slate-200/60 rounded-xl p-6 hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group"
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  <div>
                    {/* Stars */}
                    <div className="flex items-center gap-0.5 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'text-gold' : 'text-slate-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                    {/* Comment */}
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{review.comment}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200/60 pt-3 mt-3">
                    <div>
                      <div className="text-slate-800 text-xs font-semibold">{review.name}</div>
                      <div className="text-slate-400 text-[10px] font-mono mt-0.5">{review.date}</div>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                      {review.source}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form to submit review directly */}
          <div className="section-reveal bg-slate-50 border border-slate-200/80 rounded-2xl p-6 lg:sticky lg:top-28">
            <h3 className="font-display text-xl text-slate-800 mb-2">Write a Review</h3>
            <p className="text-slate-500 text-xs mb-6">Share your experience with our hardware and service.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-slate-600 text-xs font-mono uppercase tracking-wider mb-2">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="admin-input"
                  placeholder="John Doe"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-slate-600 text-xs font-mono uppercase tracking-wider mb-2">Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-gold focus:outline-none transition-transform hover:scale-110"
                    >
                      <svg
                        className={`w-8 h-8 ${star <= rating ? 'fill-current' : 'stroke-current stroke-[1.5] fill-none'}`}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-slate-600 text-xs font-mono uppercase tracking-wider mb-2">Review Comment</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="admin-input min-h-[80px]"
                  placeholder="Share details of your experience..."
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-200/60 text-center">
              <span className="text-slate-400 text-[10px] font-mono uppercase block mb-2">Or click below</span>
              <a
                href={GOOGLE_MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-xs font-semibold tracking-wider font-mono uppercase transition-colors"
              >
                Go directly to Google reviews
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
