"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Star } from "lucide-react";

interface FeedbackSectionProps {
  locationId: string;
  userId?: string;
}

interface Feedback {
  id: string;
  comment: string;
  sentiment: string;
  confidence: number;
  rating?: number | null;
  createdAt: string;
  userId: string;
  locationId: string;
}

export function FeedbackSection({ locationId, userId }: FeedbackSectionProps) {
  const { toast } = useToast();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [sentimentStats, setSentimentStats] = useState({ positive: 0, negative: 0 });

  useEffect(() => {
    fetch(`/api/location-details/${locationId}`)
      .then(res => res.json())
      .then(data => {
        setFeedbacks(data.feedbacks || []);
        // Calculate sentiment stats
        const total = data.feedbacks?.length || 0;
        const positive = data.feedbacks?.filter((f: Feedback) => f.sentiment === "Positive").length || 0;
        const negative = data.feedbacks?.filter((f: Feedback) => f.sentiment !== "Positive").length || 0;
        setSentimentStats({
          positive: total ? Math.round((positive / total) * 100) : 0,
          negative: total ? Math.round((negative / total) * 100) : 0,
        });
      });
  }, [locationId, submitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.length < 100) {
      toast({ title: "Comment too short", description: "Comment must be at least 100 characters." });
      return;
    }
    setSubmitting(true);
    // Analyze sentiment
    const sentimentRes = await fetch("/api/analyze-sentiment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: comment }),
    });
    const sentimentData = await sentimentRes.json();
    if (!sentimentRes.ok) {
      toast({ title: "Sentiment analysis failed", description: sentimentData.error || "Try again later." });
      setSubmitting(false);
      return;
    }
    // Save feedback
    const feedbackRes = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locationId,
        userId,
        comment,
        sentiment: sentimentData.sentiment,
        confidence: sentimentData.confidence,
        rating,
      }),
    });
    if (feedbackRes.ok) {
      setComment("");
      setRating(null);
      toast({ title: "Feedback submitted!" });
    } else {
      toast({ title: "Failed to submit feedback" });
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Share your experience</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <Textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          minLength={100}
          required
          placeholder="Write your comment (at least 100 characters)"
          className="w-full"
        />
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Rating (optional):</span>
          {[1,2,3,4,5].map(star => (
            <Star
              key={star}
              className={`h-5 w-5 cursor-pointer ${rating && rating >= star ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`}
              onClick={() => setRating(star)}
              fill={rating && rating >= star ? '#eab308' : 'none'}
            />
          ))}
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </form>
      {/* Feedback summary message as a colored card */}
      <div className={`mb-6 rounded-lg p-4 text-white font-semibold text-base ${feedbacks.length === 0 ? 'bg-muted-foreground' : sentimentStats.positive >= sentimentStats.negative ? 'bg-green-600' : 'bg-red-600'}`}>
        {feedbacks.length > 0 ? (
          <span>
            {feedbacks.length} users commented, {sentimentStats.positive}% positive comments for this place
          </span>
        ) : (
          <span>No comments yet.</span>
        )}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">All Comments</h3>
        {feedbacks.length === 0 ? (
          <div className="text-muted-foreground">No comments yet.</div>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((fb: Feedback) => (
              <Card key={fb.id} className="border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {/* Removed sentiment label here */}
                    {typeof fb.rating === 'number' && (
                      <span className="flex items-center gap-1 ml-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        {fb.rating}
                      </span>
                    )}
                  </div>
                  <div className="text-muted-foreground mb-1 text-xs">Confidence: {fb.confidence?.toFixed(2)}</div>
                  <div>{fb.comment}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
