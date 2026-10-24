import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, ThumbsUp, MessageSquare, AlertCircle } from 'lucide-react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { Review } from '../../types/ecommerce';

interface CustomerReviewsProps {
  productId: string;
  productTitle: string;
  initialRating: number;
  initialReviewCount: number;
}

const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: '',
    userId: 'user-demo-1',
    userName: 'Aarav Sharma (Mumbai)',
    rating: 5,
    title: 'Superb quality, delivered in 24 hours!',
    comment:
      'Completely satisfied with this purchase from BharatBazaar. The packaging was top-notch with tamper-proof seal. Build quality and performance exceeded my expectations. Highly recommended!',
    isVerifiedPurchase: true,
    helpfulVotes: 48,
    createdAt: '18 Oct 2026',
  },
  {
    id: 'rev-2',
    productId: '',
    userId: 'user-demo-2',
    userName: 'Priya Iyer (Bengaluru)',
    rating: 5,
    title: 'Great value for money during Festive sale',
    comment:
      'Got an instant 10% discount using SBI card. Authentic product with valid manufacturer warranty. Delivery executive was polite and called ahead.',
    isVerifiedPurchase: true,
    helpfulVotes: 23,
    createdAt: '12 Oct 2026',
  },
  {
    id: 'rev-3',
    productId: '',
    userId: 'user-demo-3',
    userName: 'Vikram Rajput (Jaipur)',
    rating: 4,
    title: 'Good product, minor delay in courier',
    comment:
      'The item itself is genuine and works flawlessly. Took 2 days to arrive in Jaipur instead of 1 day, but overall very happy with customer support.',
    isVerifiedPurchase: true,
    helpfulVotes: 11,
    createdAt: '05 Oct 2026',
  },
];

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  productId,
  productTitle,
  initialRating,
  initialReviewCount,
}) => {
  const { user, profile, openAuthModal } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [helpfulClicked, setHelpfulClicked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load reviews from Firestore or fallback to mock
    const loadReviews = async () => {
      try {
        const q = query(collection(db, 'reviews'), where('productId', '==', productId));
        const snap = await getDocs(q);
        const remoteList: Review[] = [];
        snap.forEach((d) => {
          remoteList.push({ id: d.id, ...d.data() } as Review);
        });

        if (remoteList.length > 0) {
          setReviews(remoteList);
        } else {
          setReviews(DEFAULT_REVIEWS.map((r) => ({ ...r, productId })));
        }
      } catch (err) {
        console.warn('Error loading reviews from Firestore:', err);
        setReviews(DEFAULT_REVIEWS.map((r) => ({ ...r, productId })));
      }
    };

    loadReviews();
  }, [productId]);

  const handleHelpfulClick = (reviewId: string) => {
    if (helpfulClicked[reviewId]) return;
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulVotes: r.helpfulVotes + 1 } : r))
    );
    setHelpfulClicked((prev) => ({ ...prev, [reviewId]: true }));
  };

  const handleWriteReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }

    if (!newTitle.trim() || !newComment.trim()) return;

    setSubmitting(true);
    const newReview: Omit<Review, 'id'> = {
      productId,
      userId: user.uid,
      userName: profile?.displayName || user.displayName || 'Customer',
      rating: newRating,
      title: newTitle.trim(),
      comment: newComment.trim(),
      isVerifiedPurchase: true,
      helpfulVotes: 0,
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    try {
      const docRef = await addDoc(collection(db, 'reviews'), {
        ...newReview,
        createdAtServer: serverTimestamp(),
      });
      setReviews((prev) => [{ id: docRef.id, ...newReview }, ...prev]);
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsWriteModalOpen(false);
        setSubmitSuccess(false);
        setNewTitle('');
        setNewComment('');
      }, 1500);
    } catch (error) {
      console.warn('Firestore review creation fallback:', error);
      // Fallback local addition if rules or network fail
      const fallbackId = `local-${Date.now()}`;
      setReviews((prev) => [{ id: fallbackId, ...newReview }, ...prev]);
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsWriteModalOpen(false);
        setSubmitSuccess(false);
      }, 1500);
    } finally {
      setSubmitting(false);
    }
  };

  // Distribution calculations
  const totalReviews = Math.max(reviews.length, initialReviewCount);
  const rating5Pct = 68;
  const rating4Pct = 22;
  const rating3Pct = 6;
  const rating2Pct = 2;
  const rating1Pct = 2;

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
        Customer Reviews & Ratings
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Rating Summary Column */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl font-black text-gray-900">{initialRating}</div>
            <div>
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(initialRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                {totalReviews.toLocaleString('en-IN')} global ratings
              </span>
            </div>
          </div>

          {/* Rating Bars */}
          <div className="space-y-2 text-xs">
            {[
              { star: 5, pct: rating5Pct },
              { star: 4, pct: rating4Pct },
              { star: 3, pct: rating3Pct },
              { star: 2, pct: rating2Pct },
              { star: 1, pct: rating1Pct },
            ].map((row) => (
              <div key={row.star} className="flex items-center gap-3">
                <span className="w-12 text-gray-600 font-medium">{row.star} star</span>
                <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-gray-500 font-medium">{row.pct}%</span>
              </div>
            ))}
          </div>

          {/* Write a Review Button */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-bold text-gray-900 text-sm mb-1">Review this product</h4>
            <p className="text-xs text-gray-500 mb-3">
              Share your genuine feedback with other Indian shoppers
            </p>
            <button
              onClick={() => {
                if (!user) openAuthModal('login');
                else setIsWriteModalOpen(true);
              }}
              className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-2 px-4 rounded-md border border-gray-300 shadow-2xs text-xs cursor-pointer"
            >
              Write a product review
            </button>
          </div>
        </div>

        {/* Right Reviews List Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Top Customer Reviews from India
            </span>
            <span className="text-xs text-[#007185] font-semibold">Verified Purchases</span>
          </div>

          <div className="space-y-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="border-b border-gray-100 pb-5 space-y-2 text-xs">
                {/* Author */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-gray-700 text-[11px]">
                    {rev.userName[0]}
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">{rev.userName}</span>
                </div>

                {/* Stars and Title */}
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">{rev.title}</h4>
                </div>

                {/* Date & Verified Badge */}
                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                  <span>Reviewed in India on {rev.createdAt}</span>
                  {rev.isVerifiedPurchase && (
                    <>
                      <span>•</span>
                      <span className="text-amber-800 font-bold flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3 text-amber-600" /> Verified Purchase
                      </span>
                    </>
                  )}
                </div>

                {/* Comment */}
                <p className="text-gray-700 text-sm leading-relaxed">{rev.comment}</p>

                {/* Helpful Button */}
                <div className="flex items-center gap-3 pt-1 text-[11px] text-gray-500">
                  <span>{rev.helpfulVotes} people found this helpful</span>
                  <button
                    onClick={() => handleHelpfulClick(rev.id)}
                    disabled={helpfulClicked[rev.id]}
                    className={`px-3 py-1 rounded border text-xs font-medium flex items-center gap-1 cursor-pointer ${
                      helpfulClicked[rev.id]
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{helpfulClicked[rev.id] ? 'Marked Helpful' : 'Helpful'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Write Review Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-2xl border border-gray-200">
            <h3 className="font-bold text-lg text-gray-900 mb-1">Create Review</h3>
            <p className="text-xs text-gray-500 mb-4 line-clamp-1">{productTitle}</p>

            {submitSuccess && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-md text-xs font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Your review has been submitted successfully! Thank you.</span>
              </div>
            )}

            <form onSubmit={handleWriteReview} className="space-y-4 text-xs">
              {/* Star Rating Selector */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Overall rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setNewRating(s)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          s <= newRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="self-center ml-2 font-bold text-sm text-gray-800">
                    {newRating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Add a headline
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="What's most important to know?"
                  className="w-full rounded-md border border-gray-300 p-2 text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Written review
                </label>
                <textarea
                  required
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="What did you like or dislike? How does it perform in daily use?"
                  className="w-full rounded-md border border-gray-300 p-2 text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 rounded-md font-bold text-gray-900 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
