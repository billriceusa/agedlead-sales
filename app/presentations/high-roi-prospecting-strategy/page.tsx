'use client';

import { useState, useEffect } from 'react';

interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
}

export default function HighROIProspectingPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      id: 1,
      title: 'The "Empty Pipeline" Problem',
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <h3 className="text-red-400 font-bold text-lg mb-3">THE CORE CONFLICT</h3>
                <ul className="space-y-3 text-lg">
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold mt-1">•</span>
                    <span><strong className="text-white">High Cost:</strong> Real-time internet leads are expensive ($10–$50+ per lead)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold mt-1">•</span>
                    <span><strong className="text-white">High Competition:</strong> If you don't call in 5 seconds, you lose. It's a "speed-to-lead" war</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold mt-1">•</span>
                    <span><strong className="text-white">Low Volume:</strong> Most agents blow their budget on a handful of leads. If those don't close, the pipeline is empty for the rest of the month</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 text-center">
                <div className="text-6xl mb-4">😰</div>
                <div className="text-4xl font-bold text-red-400 mb-2">THE RESULT</div>
                <div className="text-2xl text-white">Rollercoaster income and<br />"Call Reluctance"</div>
              </div>
            </div>
          </div>
        </div>
      ),
      backgroundColor: '#0a0a0a',
      textColor: '#ffffff',
    },
    {
      id: 2,
      title: 'The Solution – AgedLeadStore.com',
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                <h3 className="text-red-400 font-bold text-xl mb-4 uppercase">The Value Proposition</h3>
                <ul className="space-y-4 text-lg">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold text-2xl mt-1">✓</span>
                    <div>
                      <strong className="text-white">Massive Volume:</strong>
                      <span className="text-gray-300"> Get 500–1,000+ records for the price of 10-15 real-time leads</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold text-2xl mt-1">✓</span>
                    <div>
                      <strong className="text-white">Valid Context:</strong>
                      <span className="text-gray-300"> These are real people who <em>did</em> express intent for your service (Insurance, Mortgage, Solar, etc.) 30 to 90+ days ago</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold text-2xl mt-1">✓</span>
                    <div>
                      <strong className="text-white">Quality Control:</strong>
                      <span className="text-gray-300"> We clean, filter, and validate the contact info (Phone, Address, Email) so you aren't buying dead data</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                <div className="text-7xl mb-6">⚡</div>
                <div className="text-3xl font-bold text-blue-400 mb-4">FUNNEL VISUALIZATION</div>
                <div className="space-y-4">
                  <div className="bg-blue-600/30 rounded-lg p-4 border border-blue-400/50">
                    <div className="text-2xl font-bold text-white mb-2">Thousands of</div>
                    <div className="text-xl text-blue-300">Aged Leads</div>
                  </div>
                  <div className="text-white text-4xl">↓</div>
                  <div className="bg-red-600/30 rounded-lg p-4 border border-red-400/50">
                    <div className="text-xl font-bold text-white mb-2">Trickle of</div>
                    <div className="text-lg text-red-300">Real-Time Leads</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      backgroundColor: '#0a0a0a',
      textColor: '#ffffff',
    },
    {
      id: 3,
      title: 'Understanding the Data (Transparency First)',
      subtitle: 'What EXACTLY are you buying?',
      content: (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <h3 className="text-blue-400 font-bold text-xl mb-4">THE DEFINITION</h3>
            <p className="text-lg text-white mb-6">
              You are purchasing <strong className="text-blue-300">Consumer Data Records</strong> with historical intent.
            </p>
            
            <div className="bg-red-600/20 rounded-lg p-6 border border-red-400/50 mb-6">
              <h4 className="text-red-400 font-bold text-lg mb-3 uppercase">The "Non-Consent" Reality</h4>
              <ul className="space-y-3 text-white">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold mt-1">•</span>
                  <span>These consumers requested information <em>in the past</em>, likely on a generic site</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold mt-1">•</span>
                  <span><strong className="text-red-300">Crucial Distinction:</strong> They have <strong>NOT</strong> given specific consent for <em>you</em> (or your agency) to contact them today</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold mt-1">•</span>
                  <span><strong className="text-red-300">Reference:</strong> Per our Terms of Service, you must treat this data as <strong>"Cold Data with Context"</strong></span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-600/20 rounded-lg p-6 border border-blue-400/50">
              <h4 className="text-blue-400 font-bold text-lg mb-3 uppercase">The Opportunity</h4>
              <p className="text-lg text-white">
                You know their <strong className="text-blue-300">Name</strong>, their <strong className="text-blue-300">Contact Info</strong>, and exactly what they needed (e.g., "Life Insurance"). You just need the right <em className="text-blue-300">compliant</em> method to reach them.
              </p>
            </div>
          </div>
        </div>
      ),
      backgroundColor: '#0a0a0a',
      textColor: '#ffffff',
    },
    {
      id: 4,
      title: 'The Compliance "Kill Zone"',
      subtitle: 'How to Get Sued (Do NOT Do This)',
      content: (
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-red-400 font-bold text-2xl uppercase mb-2">The Rules of Engagement</h3>
              <p className="text-gray-300">These practices are strictly prohibited</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-600/30 rounded-lg p-6 border-2 border-red-500">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">🚫</span>
                  <h4 className="text-red-300 font-bold text-lg">NO Autodialers (ATDS)</h4>
                </div>
                <p className="text-white">Do not load these leads into predictive dialers or any system that dials without human intervention</p>
              </div>

              <div className="bg-red-600/30 rounded-lg p-6 border-2 border-red-500">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">🚫</span>
                  <h4 className="text-red-300 font-bold text-lg">NO Ringless Voicemails (RVM)</h4>
                </div>
                <p className="text-white">These are considered "calls" and require express written consent you do not have</p>
              </div>

              <div className="bg-red-600/30 rounded-lg p-6 border-2 border-red-500">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">🚫</span>
                  <h4 className="text-red-300 font-bold text-lg">NO Mass Texting</h4>
                </div>
                <p className="text-white">SMS blasting is strictly prohibited</p>
              </div>

              <div className="bg-red-600/30 rounded-lg p-6 border-2 border-red-500">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">🚫</span>
                  <h4 className="text-red-300 font-bold text-lg">NO Pre-Recorded Messages</h4>
                </div>
                <p className="text-white">"Press 1" campaigns are illegal on this data type</p>
              </div>
            </div>
          </div>
        </div>
      ),
      backgroundColor: '#0a0a0a',
      textColor: '#ffffff',
    },
    {
      id: 5,
      title: 'The "Safe Harbor" Strategy',
      subtitle: 'How to Prospect Safely',
      content: (
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-blue-400 font-bold text-2xl uppercase">Best Practices</h3>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-600/20 rounded-lg p-6 border border-blue-400/50">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">1</div>
                  <div className="flex-1">
                    <h4 className="text-blue-300 font-bold text-xl mb-2 uppercase">Step 1: The Mandatory Scrub</h4>
                    <p className="text-white text-lg mb-2">
                      You <strong>MUST</strong> scrub this list against the <strong className="text-blue-300">National & State Do-Not-Call (DNC) Registries</strong> before dialing.
                    </p>
                    <p className="text-gray-300 italic">
                      Note: If a number is on the DNC, you cannot call it (even manually) unless you have an existing relationship.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600/20 rounded-lg p-6 border border-blue-400/50">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">2</div>
                  <div className="flex-1">
                    <h4 className="text-blue-300 font-bold text-xl mb-2 uppercase">Step 2: Manual Outreach Only</h4>
                    <p className="text-white text-lg">
                      Use <strong className="text-blue-300">Click-to-Call</strong> or <strong className="text-blue-300">Hand Dialing</strong>. This ensures human intervention on every attempt and keeps you compliant with TCPA definitions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600/20 rounded-lg p-6 border border-blue-400/50">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">3</div>
                  <div className="flex-1">
                    <h4 className="text-blue-300 font-bold text-xl mb-2 uppercase">Step 3: Multi-Channel Approach</h4>
                    <p className="text-white text-lg">
                      Leverage non-intrusive channels first: <strong className="text-blue-300">Direct Mail</strong> (Postcards/Letters) and <strong className="text-blue-300">Door Knocking</strong> (if local).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      backgroundColor: '#0a0a0a',
      textColor: '#ffffff',
    },
    {
      id: 6,
      title: 'The "Honest Follow-Up" Script',
      subtitle: 'The "Have You Been Helped?" Strategy',
      content: (
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <div className="mb-8">
              <h3 className="text-blue-400 font-bold text-xl mb-4">CONCEPT</h3>
              <p className="text-white text-lg">
                Transparency builds trust. Don't fake a relationship that doesn't exist. Use the data to be helpful.
              </p>
            </div>

            <div className="bg-blue-600/30 rounded-lg p-8 border-2 border-blue-400 mb-8">
              <h4 className="text-blue-300 font-bold text-xl mb-4 uppercase text-center">The Script</h4>
              <div className="bg-black/50 rounded-lg p-6 border border-white/20">
                <p className="text-white text-lg leading-relaxed italic">
                  <em>"Hi [Name], this is [Agent]. I'm doing a follow-up on some older inquiry records from [Month] regarding [Product/Service].</em>
                </p>
                <p className="text-white text-lg leading-relaxed italic mt-4">
                  <em>It doesn't look like we ever spoke, so I wanted to make sure that you were able to get what you needed, or is this still on your to-do list?"</em>
                </p>
              </div>
            </div>

            <div className="bg-green-600/20 rounded-lg p-6 border border-green-400/50">
              <h4 className="text-green-300 font-bold text-lg mb-3 uppercase">Why This Works</h4>
              <ul className="space-y-2 text-white">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 font-bold mt-1">✓</span>
                  <span>It acknowledges the timeline ("older inquiry")</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 font-bold mt-1">✓</span>
                  <span>It is honest ("doesn't look like we ever spoke")</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 font-bold mt-1">✓</span>
                  <span>It is low pressure ("make sure you got what you needed")</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 font-bold mt-1">✓</span>
                  <span>It gives them an easy out if they are done, but captures the people who procrastinated</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
      backgroundColor: '#0a0a0a',
      textColor: '#ffffff',
    },
    {
      id: 7,
      title: 'Recommended Workflow for Success',
      subtitle: 'A 7-Day Roadmap',
      content: (
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <div className="grid md:grid-cols-7 gap-4">
              {[
                { day: 1, title: 'Download & Scrub', desc: 'Remove DNC numbers', icon: '📥' },
                { day: 2, title: 'Direct Mail Drop', desc: 'Send a "Yellow Letter" or Postcard', icon: '📮' },
                { day: 3, title: '', desc: '', icon: '' },
                { day: 4, title: 'Manual Call', desc: 'Use the "Honest Follow-Up" script', icon: '📞' },
                { day: 5, title: 'Personal Email', desc: 'Plain text (no HTML graphics)', icon: '📧' },
                { day: 6, title: '', desc: '', icon: '' },
                { day: 7, title: 'Door Knock', desc: 'If local—highly effective', icon: '🚪' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  {item.title ? (
                    <div className="bg-blue-600/30 rounded-lg p-4 border border-blue-400/50 flex-1 text-center">
                      <div className="text-4xl mb-2">{item.icon}</div>
                      <div className="text-blue-300 font-bold text-sm mb-1">DAY {item.day}</div>
                      <div className="text-white font-semibold text-sm mb-2">{item.title}</div>
                      <div className="text-gray-300 text-xs">{item.desc}</div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-gray-500 text-2xl">→</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8 bg-yellow-600/20 rounded-lg p-4 border border-yellow-400/50">
              <p className="text-yellow-300 text-sm text-center">
                <strong>Note:</strong> Direct Mail subject: <em>"I see you were looking for help recently..."</em> | 
                Email subject: <em>"Still looking?"</em>
              </p>
            </div>
          </div>
        </div>
      ),
      backgroundColor: '#0a0a0a',
      textColor: '#ffffff',
    },
    {
      id: 8,
      title: 'The Math (ROI Analysis)',
      content: (
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-red-600/30 rounded-lg p-6 border-2 border-red-500">
                <h3 className="text-red-300 font-bold text-2xl mb-4 uppercase text-center">Scenario A (Real-Time)</h3>
                <div className="space-y-3 text-white">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">$500</div>
                    <div className="text-lg">spend = <strong>20 Leads</strong></div>
                  </div>
                  <div className="pt-4 border-t border-red-400/50 space-y-2">
                    <p className="text-sm">• High stress, high competition</p>
                    <p className="text-sm">• Need <strong>10% conversion</strong> to make</p>
                    <div className="text-3xl font-bold text-red-300 text-center mt-4">2 Sales</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600/30 rounded-lg p-6 border-2 border-blue-500">
                <h3 className="text-blue-300 font-bold text-2xl mb-4 uppercase text-center">Scenario B (Aged Leads)</h3>
                <div className="space-y-3 text-white">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">$500</div>
                    <div className="text-lg">spend = <strong>1,000 Records</strong></div>
                  </div>
                  <div className="pt-4 border-t border-blue-400/50 space-y-2 text-sm">
                    <p>• Scrub 40% for DNC = <strong>600 Callable Records</strong></p>
                    <p className="mt-4">• Need only <strong className="text-blue-300">1% Conversion</strong> to make</p>
                    <div className="text-3xl font-bold text-blue-300 text-center mt-4">6 Sales</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-600/30 rounded-lg p-6 border-2 border-green-500 text-center">
              <h3 className="text-green-300 font-bold text-xl mb-2 uppercase">The Takeaway</h3>
              <p className="text-white text-lg">
                It is a manual volume game. The conversion rate is lower, but the <strong className="text-green-300">Profit</strong> is significantly higher.
              </p>
            </div>
          </div>
        </div>
      ),
      backgroundColor: '#0a0a0a',
      textColor: '#ffffff',
    },
    {
      id: 9,
      title: 'Why AgedLeadStore.com?',
      content: (
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-600/20 rounded-lg p-6 border border-blue-400/50">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🏆</span>
                  <h4 className="text-blue-300 font-bold text-lg">Trusted Source</h4>
                </div>
                <p className="text-white">
                  24+ Years in Business (Since 2001). <strong className="text-blue-300">A+ BBB Rating</strong>
                </p>
              </div>

              <div className="bg-blue-600/20 rounded-lg p-6 border border-blue-400/50">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">⚙️</span>
                  <h4 className="text-blue-300 font-bold text-lg">Proprietary Tech</h4>
                </div>
                <p className="text-white">
                  "Evergreen Lead Optimization" – We constantly validate phones/addresses so you aren't buying junk
                </p>
              </div>

              <div className="bg-blue-600/20 rounded-lg p-6 border border-blue-400/50">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🔄</span>
                  <h4 className="text-blue-300 font-bold text-lg">Replacement Guarantee</h4>
                </div>
                <p className="text-white">
                  We replace disconnected numbers or wrong data types (<strong className="text-blue-300">Self-Service Dashboard</strong>)
                </p>
              </div>

              <div className="bg-blue-600/20 rounded-lg p-6 border border-blue-400/50">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">📚</span>
                  <h4 className="text-blue-300 font-bold text-lg">Training Included</h4>
                </div>
                <p className="text-white">
                  We provide the resources, guides, and tips to help you master the "Aged Lead" approach
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      backgroundColor: '#0a0a0a',
      textColor: '#ffffff',
    },
    {
      id: 10,
      title: 'Your Next Step',
      subtitle: 'Start Your High-Volume Campaign',
      content: (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-blue-400 font-bold text-2xl uppercase mb-4">Call to Action</h3>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-600/30 rounded-lg p-6 border-2 border-blue-400">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">1</div>
                  <div className="flex-1">
                    <p className="text-white text-lg">
                      Create your <strong className="text-blue-300">Free Account</strong> at <strong className="text-blue-300">AgedLeadStore.com</strong> (No credit card required to browse)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600/30 rounded-lg p-6 border-2 border-blue-400">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">2</div>
                  <div className="flex-1">
                    <p className="text-white text-lg">
                      Secure a subscription to a <strong className="text-blue-300">DNC Scrubber</strong> (Third Party)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600/30 rounded-lg p-6 border-2 border-blue-400">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">3</div>
                  <div className="flex-1">
                    <p className="text-white text-lg">
                      Run a count in your <strong className="text-blue-300">Zip Code</strong> to see the inventory
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600/30 rounded-lg p-6 border-2 border-blue-400">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">4</div>
                  <div className="flex-1">
                    <p className="text-white text-lg">
                      Download your first batch and start your <strong className="text-blue-300">"Honest Follow-Up"</strong> calls
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <a
                href="https://agedleadstore.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors border-2 border-blue-500"
              >
                Visit AgedLeadStore.com →
              </a>
            </div>
          </div>
        </div>
      ),
      backgroundColor: '#0a0a0a',
      textColor: '#ffffff',
    },
  ];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [slides.length]);

  const currentSlideData = slides[currentSlide];

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/20 px-6 py-4 flex items-center justify-between">
        <a
          href="/"
          className="text-gray-400 hover:text-white transition-colors text-sm"
        >
          ← Back to presentations
        </a>
        <div className="text-sm text-gray-400">
          Slide {currentSlide + 1} of {slides.length}
        </div>
      </div>

      {/* Main Slide Content */}
      <div
        className="h-full pt-20 pb-24 px-8 md:px-16 overflow-y-auto"
        style={{
          backgroundColor: currentSlideData.backgroundColor || '#0a0a0a',
          color: currentSlideData.textColor || '#ffffff',
        }}
      >
        <div className="max-w-7xl mx-auto h-full flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {currentSlideData.title}
            </h1>
            {currentSlideData.subtitle && (
              <h2 className="text-2xl md:text-3xl text-gray-300 font-semibold">
                {currentSlideData.subtitle}
              </h2>
            )}
          </div>
          <div className="flex-1 flex items-center">
            {currentSlideData.content}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-t border-white/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
            disabled={currentSlide === 0}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            ← Previous
          </button>

          {/* Slide Dots */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide
                    ? 'bg-blue-500'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))}
            disabled={currentSlide === slides.length - 1}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
