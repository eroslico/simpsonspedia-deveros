import { useState } from "react";
import { Star, Send, Trash2, Edit2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReviews, Review } from "@/hooks/useReviews";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ReviewSectionProps {
  episodeId: number;
  episodeName: string;
}

function StarRating({ 
  rating, 
  onRate, 
  readonly = false,
  size = "md"
}: { 
  rating: number; 
  onRate?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          className={cn(
            "transition-all",
            !readonly && "hover:scale-110 cursor-pointer",
            readonly && "cursor-default"
          )}
        >
          <Star
            className={cn(
              sizes[size],
              "transition-colors",
              (hoverRating || rating) >= star
                ? "fill-primary text-primary"
                : "fill-muted text-muted-foreground"
            )}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ 
  review, 
  onEdit, 
  onDelete 
}: { 
  review: Review;
  onEdit: (review: Review) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-muted/50 rounded-xl p-4 border border-border">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={review.rating} readonly size="sm" />
            <span className="text-sm text-muted-foreground font-body">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
          {review.comment && (
            <p className="text-foreground font-body text-sm">{review.comment}</p>
          )}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(review)}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            aria-label="Edit review"
          >
            <Edit2 className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => onDelete(review.id)}
            className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
            aria-label="Delete review"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ReviewSection({ episodeId, episodeName }: ReviewSectionProps) {
  const { 
    addReview, 
    updateReview, 
    deleteReview, 
    getReviewsForEpisode,
    getAverageRating 
  } = useReviews();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const episodeReviews = getReviewsForEpisode(episodeId);
  const averageRating = getAverageRating(episodeId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (editingReview) {
      updateReview(editingReview.id, rating, comment);
      toast.success("Review updated!");
      setEditingReview(null);
    } else {
      addReview(episodeId, episodeName, rating, comment);
      toast.success("Review added!");
    }
    
    setRating(0);
    setComment("");
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment);
    setIsExpanded(true);
  };

  const handleDelete = (id: string) => {
    deleteReview(id);
    toast.success("Review deleted");
  };

  const cancelEdit = () => {
    setEditingReview(null);
    setRating(0);
    setComment("");
  };

  return (
    <div className="bg-card rounded-2xl p-4 border-2 border-border">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Star className="w-5 h-5 text-primary" />
          <span className="font-heading font-bold text-foreground">Reviews</span>
          {episodeReviews.length > 0 && (
            <span className="px-2 py-0.5 bg-primary/20 rounded-full text-xs font-heading text-primary">
              {episodeReviews.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {averageRating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="text-sm font-heading text-foreground">
                {averageRating.toFixed(1)}
              </span>
            </div>
          )}
          <span className={cn(
            "text-muted-foreground transition-transform",
            isExpanded && "rotate-180"
          )}>
            ▼
          </span>
        </div>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="mt-4 space-y-4 animate-bounce-in">
          {/* Add/Edit Review Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-heading text-foreground">
                {editingReview ? "Edit your rating" : "Rate this episode"}
              </label>
              {editingReview && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <StarRating rating={rating} onRate={setRating} size="lg" />
            
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts (optional)..."
              className="w-full px-3 py-2 bg-muted rounded-xl font-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={2}
              maxLength={500}
            />
            
            <Button
              type="submit"
              disabled={rating === 0}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-heading rounded-full"
            >
              <Send className="w-4 h-4 mr-2" />
              {editingReview ? "Update Review" : "Submit Review"}
            </Button>
          </form>

          {/* Reviews List */}
          {episodeReviews.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-border">
              <h4 className="text-sm font-heading text-muted-foreground">
                Your Reviews
              </h4>
              {episodeReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { StarRating };

