'use client';

/**
 * Team Member Card Component
 * Display individual team member with bio, role, achievements
 */

import React from 'react';
import { motion } from 'framer-motion';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  achievements: string[];
  image?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  expertise: string[];
}

interface TeamMemberCardProps {
  member: TeamMember;
  variant?: 'card' | 'featured';
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, variant = 'card' }) => {
  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-green-50 to-white border-4 border-[#2E7D32] rounded-lg overflow-hidden"
      >
        {/* Image Section */}
        {member.image && (
          <div className="h-64 bg-gradient-to-b from-green-100 to-green-50 flex items-center justify-center">
            <div className="text-6xl antialiased">👤</div>
          </div>
        )}

        {/* Content */}
        <div className="p-8">
          <h2 className="text-3xl font-bold text-black mb-2 antialiased">{member.name}</h2>
          <p className="text-xl text-[#2E7D32] font-bold mb-4 antialiased">{member.role}</p>

          <p className="text-gray-700 mb-6 text-lg leading-relaxed antialiased">{member.bio}</p>

          {/* Expertise */}
          <div className="mb-6">
            <p className="font-bold text-black mb-3 antialiased">Expertise:</p>
            <div className="flex flex-wrap gap-2">
              {member.expertise.map((skill, idx) => (
                <span key={idx} className="bg-[#2E7D32] text-[#2E7D32] px-3 py-1 rounded-full text-sm font-bold antialiased">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Achievements */}
          {member.achievements.length > 0 && (
            <div>
              <p className="font-bold text-black mb-3 antialiased">Achievements:</p>
              <ul className="space-y-2">
                {member.achievements.map((achievement, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <span className="text-[#2E7D32] mt-1">✓</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Default card variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      className="bg-white border-2 border-black rounded-lg overflow-hidden hover:shadow-lg transition-all"
    >
      {/* Avatar */}
      <div className="h-48 bg-gradient-to-b from-green-100 to-green-50 flex items-center justify-center border-b-2 border-black">
        <div className="text-6xl antialiased">👤</div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-black mb-1 antialiased">{member.name}</h3>
        <p className="text-[#2E7D32] font-bold mb-3 antialiased">{member.role}</p>

        <p className="text-gray-700 text-sm mb-4 line-clamp-3">{member.bio}</p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {member.expertise.slice(0, 2).map((skill, idx) => (
            <span key={idx} className="text-xs bg-[#2E7D32] text-[#2E7D32] px-2 py-1 rounded border border-[#2E7D32] font-bold antialiased">
              {skill}
            </span>
          ))}
          {member.expertise.length > 2 && (
            <span className="text-xs bg-gray-100 text-black px-2 py-1 rounded border border-black font-bold antialiased">
              +{member.expertise.length - 2} more
            </span>
          )}
        </div>

        {/* Social Links */}
        {member.social && (
          <div className="flex gap-3 justify-center">
            {member.social.linkedin && (
              <a href={member.social.linkedin} className="text-[#2E7D32] hover:text-[#2E7D32] font-bold antialiased">
                LinkedIn
              </a>
            )}
            {member.social.twitter && (
              <a href={member.social.twitter} className="text-[#2E7D32] hover:text-[#2E7D32] font-bold antialiased">
                Twitter
              </a>
            )}
            {member.social.instagram && (
              <a href={member.social.instagram} className="text-[#2E7D32] hover:text-[#2E7D32] font-bold antialiased">
                Instagram
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TeamMemberCard;
