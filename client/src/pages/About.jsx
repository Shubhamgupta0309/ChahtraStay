import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import React from "react";

function About() {
  document.title="About ChahtraStay"
  return (
    <div className="flex flex-col min-h-screen w-full bg-purple-50">
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <Header />
      </div>

      <main className="flex flex-col items-center px-6 md:px-20 py-10 space-y-8">
        <h1 className="text-3xl font-bold text-center">
          About Travel<span className="text-purple-900">Tribe</span>
        </h1>

        <Card className="w-full max-w-3xl p-6 shadow-lg">
          <CardTitle className="text-xl mb-4 text-purple-900">
            What is ChahtraStay?
          </CardTitle>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              ChahtraStay is a student-focused hostel booking platform designed
              to simplify the search for affordable and comfortable
              accommodations. Whether you're a student moving to a new city or a
              traveler looking for a budget stay, ChahtraStay helps you find
              well-reviewed hostels with ease.
            </p>
          </CardContent>
        </Card>

        <Card className="w-full max-w-3xl p-6 shadow-lg">
          <CardTitle className="text-xl mb-4 text-purple-900">
            Our Mission
          </CardTitle>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              We aim to provide a seamless and hassle-free hostel booking
              experience with transparent pricing, verified listings, and user
              reviews. Our platform ensures that students and young
              professionals can find safe, affordable, and well-maintained
              accommodations near their universities or workplaces.
            </p>
          </CardContent>
        </Card>

        <Card className="w-full max-w-3xl p-6 shadow-lg">
          <CardTitle className="text-xl mb-4 text-purple-900">
            Join Our Community
          </CardTitle>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              ChahtraStay is more than just a booking platform—it’s a growing
              community of students and travelers sharing real experiences. Join
              us in creating a trusted network of accommodations for students
              everywhere!
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

export default About;
