"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const INTEREST_OPTIONS = [
  "Beaches",
  "Bodies of Water",
  "Farms",
  "Gardens",
  "Historic Sites",
  "Museums",
  "National Parks",
  "Nature & Wildlife Areas",
  "Waterfalls",
  "Zoological Gardens",
  "Religious Sites",
];

export default function UserOnboardingModal() {
  const { user, isLoaded } = useUser();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    introduction: "",
    interests: [] as string[],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoaded || !user) return;
    // Check if user exists in DB
    fetch(`/api/user/onboard?clerkUserId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.exists) {
          setForm({
            name: user.firstName || "",
            email: user.emailAddresses?.[0]?.emailAddress || "",
            introduction: "",
            interests: [],
          });
          setOpen(true);
        }
      });
  }, [isLoaded, user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleInterestToggle = (interest: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/user/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkUserId: user?.id,
          ...form,
        }),
      });
      if (!res.ok) throw new Error("Failed to save user info");
      setOpen(false);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold">Welcome! Tell us about yourself</h2>
          <Input
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            type="email"
          />
          <Textarea
            name="introduction"
            placeholder="Short introduction (e.g. I like to see wild animals)"
            value={form.introduction}
            onChange={handleChange}
            required
            className="w-full min-h-[80px]"
          />
          <div>
            <div className="mb-2 font-medium">Select your interests:</div>
            <div className="grid grid-cols-2 gap-2">
              {INTEREST_OPTIONS.map((interest) => (
                <Card
                  key={interest}
                  className={`p-2 flex items-center cursor-pointer transition-colors ${
                    form.interests.includes(interest)
                      ? "border-primary bg-primary/10"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => handleInterestToggle(interest)}
                >
                  <Badge
                    variant={
                      form.interests.includes(interest) ? "default" : "outline"
                    }
                    className="w-full text-center"
                  >
                    {interest}
                  </Badge>
                </Card>
              ))}
            </div>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button
            type="submit"
            className="w-full"
            disabled={
              loading ||
              !form.name ||
              !form.email ||
              !form.introduction ||
              form.interests.length === 0
            }
          >
            {loading ? "Saving..." : "Save and Continue"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
