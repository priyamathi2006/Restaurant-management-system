import React from "react";
import { Link } from "react-router-dom";
import { Utensils, Heart, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8 text-textGray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="p-2 bg-gradient-to-tr from-accentAmber to-accentOrange rounded-xl text-white">
                <Utensils className="h-5 w-5" />
              </span>
              <span className="font-heading font-bold text-xl tracking-tight text-textLight">
                Aura<span className="text-accentAmber"> Dining</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Experience gourmet culinary excellence right at your doorstep. We curate organic, fresh ingredients to make unforgettable dishes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-textLight font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-accentAmber transition-colors">Home</Link></li>
              <li><Link to="/menu" className="hover:text-accentAmber transition-colors">Menu Options</Link></li>
              <li><Link to="/reservation" className="hover:text-accentAmber transition-colors">Reserve Table</Link></li>
              <li><Link to="/login" className="hover:text-accentAmber transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-textLight font-semibold mb-4 text-lg">Opening Hours</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Mon - Fri:</span>
                <span className="text-textLight font-medium">10:00 AM - 11:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sat - Sun:</span>
                <span className="text-textLight font-medium">09:00 AM - 12:00 AM</span>
              </li>
              <li className="flex justify-between">
                <span>Kitchen Close:</span>
                <span className="text-accentAmber font-medium">45 Mins Before Close</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-textLight font-semibold mb-4 text-lg">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accentAmber" />
                <span>+1 (555) 019-2834</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accentAmber" />
                <span>support@auradining.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accentAmber" />
                <span>42 Wallaby Way, Sydney</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy; {new Date().getFullYear()} Aura Dining Inc. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-4 md:mt-0">
            Crafted with <Heart className="h-3.5 w-3.5 text-accentOrange fill-accentOrange" /> by the DeepMind team.
          </p>
        </div>
      </div>
    </footer>
  );
}
