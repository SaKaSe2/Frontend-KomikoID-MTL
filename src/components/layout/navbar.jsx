'use client';

import { useState } from 'react';
import { Search, Moon, Menu, X, Bookmark, BookOpen, TrendingUp, Home } from 'lucide-react';

export default function Navbar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { name: 'Beranda', href: '/', icon: Home },
    { name: 'Daftar Komik', href: '/comics', icon: BookOpen },
    { name: 'Populer Komik', href: '/popular', icon: TrendingUp },
    { name: 'Bookmark', href: '/bookmark', icon: Bookmark },
  ];

  return (
    <nav className="bg-[#F9A825] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              {/* Book Icon with layered effect */}
              <div className="relative">
                <div className="w-12 h-14 bg-amber-800 rounded transform -rotate-6 absolute -left-1"></div>
                <div className="w-12 h-14 bg-amber-700 rounded transform -rotate-3 absolute"></div>
                <div className="w-12 h-14 bg-amber-600 rounded relative flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-orange-100" strokeWidth={2.5} />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-amber-900 leading-none">komiko</span>
              <span className="text-xs text-amber-800 leading-none">Baca Komik Online</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 rounded-lg text-amber-900 font-medium hover:bg-white/30 transition-all duration-200 flex items-center space-x-2 group"
                >
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>{link.name}</span>
                </a>
              );
            })}
          </div>

          {/* Search Bar & Dark Mode */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Search Bar */}
            <div className={`relative transition-all duration-300 ${isSearchFocused ? 'w-72' : 'w-56'}`}>
              <input
                type="text"
                placeholder="Pencarian"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full px-4 py-2.5 pl-10 pr-4 bg-white/90 backdrop-blur-sm border-2 border-transparent rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:border-white focus:bg-white focus:shadow-lg transition-all duration-200"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button className="p-2.5 rounded-full bg-amber-900 text-white hover:bg-amber-800 transition-colors duration-200 flex items-center space-x-2 px-4">
              <Moon className="w-5 h-5" />
              <span className="text-sm font-medium">MALAM</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-amber-900 hover:bg-white/30 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-orange-300/50 pt-4">
            {/* Mobile Search */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Pencarian"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 pr-4 bg-white/90 backdrop-blur-sm rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:bg-white focus:shadow-lg transition-all"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>

            {/* Mobile Navigation Links */}
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-amber-900 font-medium hover:bg-white/30 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </a>
              );
            })}

            {/* Mobile Dark Mode */}
            <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-amber-900 text-white hover:bg-amber-800 transition-colors">
              <Moon className="w-5 h-5" />
              <span className="font-medium">Mode Malam</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}