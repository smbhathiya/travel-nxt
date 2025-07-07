"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
	Landmark,
	Flower,
	TreePine,
	PawPrint,
	Tractor,
	Waves,
	Church,
	Book,
	Heater,
} from "lucide-react";

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
		introduction: "",
		interests: [] as string[],
	});
	const [error, setError] = useState("");

	useEffect(() => {
		if (!isLoaded || !user) return;
		fetch(`/api/user/onboard?clerkUserId=${user.id}`)
			.then((res) => res.json())
			.then((data) => {
				if (!data.exists) {
					setForm({
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
					name: user?.firstName || "",
					email: user?.emailAddresses?.[0]?.emailAddress || "",
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

	// Icon mapping for interests
	const INTEREST_ICONS: Record<string, React.ReactNode> = {
		Beaches: <Waves className="w-5 h-5 text-blue-500" />,
		"Bodies of Water": <Heater className="w-5 h-5 text-blue-400" />,
		Farms: <Tractor className="w-5 h-5 text-green-700" />,
		Gardens: <Flower className="w-5 h-5 text-pink-500" />,
		"Historic Sites": <Landmark className="w-5 h-5 text-yellow-700" />,
		Museums: <Book className="w-5 h-5 text-purple-600" />,
		"National Parks": <TreePine className="w-5 h-5 text-green-600" />,
		"Nature & Wildlife Areas": <PawPrint className="w-5 h-5 text-orange-600" />,
		Waterfalls: <Waves className="w-5 h-5 text-cyan-500" />,
		"Zoological Gardens": <Book className="w-5 h-5 text-amber-700" />,
		"Religious Sites": <Church className="w-5 h-5 text-red-600" />,
	};

	return (
		<Dialog open={open}>
			<DialogContent className="max-w-md w-full sm:max-w-2xl sm:w-[600px] sm:h-[80vh] sm:max-h-[80vh] h-[90vh] max-h-[90vh] pb-6">
				<form onSubmit={handleSubmit} className="space-y-4">
					<h2 className="text-xl font-bold">
						{`Welcome, ${user?.firstName || ""}! Tell us about yourself`}
					</h2>
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
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
									<span className="mr-2">{INTEREST_ICONS[interest]}</span>
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
