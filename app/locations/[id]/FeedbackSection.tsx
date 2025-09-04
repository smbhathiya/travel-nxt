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

interface SentimentResult {
  sentiment?: string;
  confidence?: number;
}

export function FeedbackSection({ locationId, userId }: FeedbackSectionProps) {
  const { toast } = useToast();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [sentimentStats, setSentimentStats] = useState({ positive: 0, negative: 0 });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/location-details/${locationId}`);
        if (!mounted) return;
        if (!res.ok) {
          console.warn('Failed to fetch location details for feedbacks', res.status);
          setFeedbacks([]);
          setSentimentStats({ positive: 0, negative: 0 });
          return;
        }
        const text = await res.text();
        if (!mounted) return;
        if (!text) {
          setFeedbacks([]);
          setSentimentStats({ positive: 0, negative: 0 });
          return;
        }
        try {
          const data = JSON.parse(text);
          const fbs = data.feedbacks || [];
          setFeedbacks(fbs);
          // Calculate sentiment stats
          const total = fbs.length || 0;
          const positive = fbs.filter((f: Feedback) => f.sentiment === "Positive").length || 0;
          const negative = total - positive;
          setSentimentStats({
            positive: total ? Math.round((positive / total) * 100) : 0,
            negative: total ? Math.round((negative / total) * 100) : 0,
          });
        } catch (err) {
          console.error('Invalid JSON for location details feedbacks', err, text);
          setFeedbacks([]);
          setSentimentStats({ positive: 0, negative: 0 });
        }
      } catch (err) {
        console.error('Error fetching location details for feedbacks', err);
        if (mounted) {
          setFeedbacks([]);
          setSentimentStats({ positive: 0, negative: 0 });
        }
      }
    })();

    return () => { mounted = false; };
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
    if (!sentimentRes.ok) {
      const text = await sentimentRes.text().catch(() => '');
      let errMsg = 'Try again later.';
      try {
        const parsed = text ? JSON.parse(text) : null;
        errMsg = parsed?.error || errMsg;
      } catch {}
      toast({ title: "Sentiment analysis failed", description: errMsg });
      setSubmitting(false);
      return;
    }
    const sentimentText = await sentimentRes.text();
    let sentimentData: SentimentResult = {};
    try {
      sentimentData = sentimentText ? (JSON.parse(sentimentText) as SentimentResult) : {};
    } catch (err) {
      console.error('Invalid JSON from sentiment API', err, sentimentText);
      toast({ title: 'Sentiment analysis failed', description: 'Invalid response from analysis service.' });
      setSubmitting(false);
      return;
    }
    const sentimentPayload = {
      sentiment: sentimentData?.sentiment ?? 'Neutral',
      confidence: typeof sentimentData?.confidence === 'number' ? sentimentData.confidence : 0,
    };
    // Save feedback
    const feedbackRes = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locationId,
        userId,
        comment,
        sentiment: sentimentPayload.sentiment,
        confidence: sentimentPayload.confidence,
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
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            className={`h-4 w-4 ${
                              index < fb.rating! 
                                ? 'text-yellow-500 fill-yellow-500' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </span>
                    )}
                  </div>
                  {/* <div className="text-muted-foreground mb-1 text-xs">Confidence: {fb.confidence?.toFixed(2)}</div> */}
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
