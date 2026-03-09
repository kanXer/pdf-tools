"use client";

import { FaFacebook, FaInstagram, FaWhatsapp, FaGithub } from "react-icons/fa";
import { useState } from "react";

export default function ContactPage() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {

    const e: string[] = [];

    if (!form.name.trim()) e.push("Name is required");
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email))
      e.push("Valid email required");
    if (!form.message.trim()) e.push("Message required");

    return e;

  };

  const sendMessage = async (e: React.FormEvent) => {

    e.preventDefault();

    const v = validate();

    if (v.length) {
      setErrors(v);
      setSuccess("");
      return;
    }

    setErrors([]);

    const text =
      `📩 New Contact Message\n` +
      `Name: ${form.name}\n` +
      `Email: ${form.email}\n` +
      `Message: ${form.message}`;

    try {

      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ msg: text }),
      });

      const json = await res.json();

      if (json?.success) {
        setSuccess("Your message has been sent.");
        setForm({ name: "", email: "", message: "" });
      } else {
        setSuccess("ERROR: API Error");
      }

    } catch {
      setSuccess("ERROR: Could not reach API");
    }

  };

  return (

    <main className="min-h-screen bg-white">

      {/* HEADER */}

      <section className="text-center py-16 px-6">

        <h1 className="text-4xl font-bold text-gray-900">
          Contact Us
        </h1>

        <p className="mt-4 text-gray-600">
          Have questions or want to collaborate? Send us a message.
        </p>

      </section>

      {/* CONTENT */}

      <section className="max-w-6xl mx-auto px-6 pb-20">

        <div className="grid md:grid-cols-2 gap-10">

          {/* FORM */}

          <div className="bg-white border rounded-xl p-8 shadow-sm">

            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded mb-6">
                <ul className="list-disc ml-5">
                  {errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded mb-6">
                {success}
              </div>
            )}

            <form onSubmit={sendMessage} className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-lg px-4 py-2"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg w-full"
              >
                Send Message
              </button>

            </form>

          </div>

          {/* CONTACT INFO */}

          <div className="bg-white border rounded-xl p-8 shadow-sm flex flex-col items-center text-center">

            <h2 className="text-xl font-semibold mb-4">
              Contact Information
            </h2>

            <p className="text-gray-600">
              Email: user.kanxer@gmail.com
            </p>

            <p className="text-gray-600 mt-2">
              Phone: +91 9696262007
            </p>

            <p className="text-gray-600 mt-2">
              Location: Uttar Pradesh, India
            </p>

            <hr className="my-6 w-full" />

            <h3 className="font-semibold mb-4">
              Follow Me
            </h3>

            <div className="flex gap-6">

              <a
                href="https://facebook.com/sahil.srivastava.1004"
                target="_blank"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition text-blue-600"
              >
                <FaFacebook />
              </a>

              <a
                href="https://instagram.com/p.c.kill3r"
                target="_blank"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition text-pink-600"
              >
                <FaInstagram />
              </a>

              <a
                href="https://wa.me/919696262007"
                target="_blank"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition text-green-600"
              >
                <FaWhatsapp />
              </a>

              <a
                href="https://github.com/kanXer"
                target="_blank"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-800"
              >
                <FaGithub />
              </a>

            </div>

          </div>

        </div>

      </section>

    </main>

  );

}