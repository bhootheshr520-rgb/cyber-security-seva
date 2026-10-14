import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import {
  GitFork,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  PhoneCall,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Compass,
  Maximize2,
  ChevronRight,
  Check,
  Play,
  Flame,
  Info
} from 'lucide-react';

export interface FlowchartNodeData {
  id: string;
  label: string;
  description: string;
  type: 'root' | 'decision' | 'safe' | 'caution' | 'critical';
  choiceText?: string; // Choice label on edge, e.g. "Yes" or "No"
  tip?: string;
  callShortcut?: string; // e.g. "tel:1930"
  actionType?: 'sos' | 'mitigation' | 'evidence' | 'none';
  actionLabel?: string;
  children?: FlowchartNodeData[];
}

export interface ScenarioFlowchart {
  id: string;
  title: string;
  subtitle: string;
  category: 'Identity & Calls' | 'Banking & UPI' | 'Remote Apps & APKs' | 'Job & Task' | 'Blackmail Protection';
  badge: string;
  summary: string;
  root: FlowchartNodeData;
}

export const SCENARIO_FLOWCHARTS: ScenarioFlowchart[] = [
  {
    id: 'flow-digital-arrest',
    title: 'Digital Arrest & Law Enforcement Video Impersonation',
    subtitle: 'Decision matrix when contacted by fake Police, CBI, ED, or Customs on Skype/WhatsApp',
    category: 'Identity & Calls',
    badge: 'Critical Protocol',
    summary: 'Evaluate what actions to take if an unverified caller claims your Aadhaar is linked to illegal parcels or money laundering and demands you stay on camera.',
    root: {
      id: 'da-root',
      label: 'Urgent Video Call / Parcel Threat Received',
      description: 'Incoming call claiming a contraband parcel in your name was seized by Customs or Mumbai Police with arrest warrant pending.',
      type: 'root',
      tip: 'Remember: Indian Police & Courts NEVER conduct arrests, bail, or interrogations on Skype or video calls.',
      children: [
        {
          id: 'da-ans-yes',
          choiceText: 'Answered / Joined Call',
          label: 'Forced onto Video / Skype Camera?',
          description: 'Attacker in fake police uniform orders you into "Digital Remand", forbidding you from hanging up or informing family.',
          type: 'decision',
          children: [
            {
              id: 'da-transfer-check',
              choiceText: 'Yes (Stayed on Call)',
              label: 'Demanded "Asset Audit / Verification" Transfer?',
              description: 'Caller demands liquidating savings into a "Secret Reserve Bank Escrow / Bail Account" to verify innocence.',
              type: 'decision',
              children: [
                {
                  id: 'da-transferred-yes',
                  choiceText: 'Yes (Money Sent)',
                  label: 'CRITICAL EMERGENCY: Funds Diverted to Mule Account',
                  description: 'Hang up immediately! You are in zero legal danger. Call 1930 within the Golden Hour to place an automated lien on beneficiary bank.',
                  type: 'critical',
                  tip: 'Do not panic. You are 100% the victim of organized crime. Police will protect you under Zero-FIR BNSS 173.',
                  callShortcut: 'tel:1930',
                  actionType: 'sos',
                  actionLabel: 'Call 1930 Helpline Now'
                },
                {
                  id: 'da-transferred-no',
                  choiceText: 'No (Refused to Pay)',
                  label: 'SAFE CONTAINMENT: Disconnect Call Immediately',
                  description: 'Hang up and block the contact. No money lost. Preserve screenshots of Skype ID and forged warrant stamps, then report to 1930 & Chakshu.',
                  type: 'safe',
                  tip: 'Disconnecting terminates their psychological control completely. You are safe in your home.',
                  actionType: 'evidence',
                  actionLabel: 'Save Call Screenshots'
                }
              ]
            },
            {
              id: 'da-ans-hungup',
              choiceText: 'No (Hung up early)',
              label: 'PREVENTED: Call Terminated Early',
              description: 'Caller was unable to isolate you. Block the phone number and report caller ID on DoT Chakshu portal (sancharsaathi.gov.in).',
              type: 'safe',
              tip: 'Scammers target thousands per day; once disconnected, they abandon the target.',
              actionType: 'none'
            }
          ]
        },
        {
          id: 'da-ans-no',
          choiceText: 'Ignored / Blocked Call',
          label: 'AVERTED: Threat Deflected',
          description: 'Unsolicited international or spoofed IVR ignored. Zero risk to your legal status or identity.',
          type: 'safe',
          tip: 'Official legal summons arrive via registered physical letters with Section 41A CrPC / 35 BNSS case diary numbers.',
          actionType: 'none'
        }
      ]
    }
  },
  {
    id: 'flow-upi-rules',
    title: 'UPI Collect & QR Code Advance Payment Trap',
    subtitle: 'Decision matrix when receiving money from buyers on OLX, Marketplace, or refunds',
    category: 'Banking & UPI',
    badge: 'Essential Rule',
    summary: 'Deconstruct incoming payment claims to guarantee you never inadvertently authorize an outgoing bank debit.',
    root: {
      id: 'upi-root',
      label: 'Buyer / Caller Claims Sending You Money',
      description: 'An online marketplace buyer or refund agent promises to transfer money to your Google Pay, PhonePe, or Paytm account.',
      type: 'root',
      tip: 'The Golden Protocol of UPI: You ONLY enter your UPI PIN to SEND or DEDUCT money. RECEIVING money NEVER requires a PIN.',
      children: [
        {
          id: 'upi-qr-check',
          choiceText: 'Prompt Received',
          label: 'Did They Send a QR Code or "Collect Request"?',
          description: 'Fraudster sends a QR code labeled "Scan to Credit ₹15,000" or creates a Collect Request notification in your UPI app.',
          type: 'decision',
          children: [
            {
              id: 'upi-pin-check',
              choiceText: 'Yes (QR / Collect Sent)',
              label: 'Asked to Enter Your Secret 4/6-Digit UPI PIN?',
              description: 'Scammer instructs: "Click Pay and enter your PIN so bank can authenticate incoming transfer."',
              type: 'decision',
              children: [
                {
                  id: 'upi-pin-entered',
                  choiceText: 'Yes (PIN Entered)',
                  label: 'EMERGENCY: Outgoing Debit Authorized',
                  description: 'Entering PIN executes an OUTGOING debit. Call 1930 immediately with transaction UTR to freeze receiver account. Lock UPI ID in your banking app.',
                  type: 'critical',
                  tip: 'Report to your bank within 3 days for RBI Zero-Liability customer protection.',
                  callShortcut: 'tel:1930',
                  actionType: 'sos',
                  actionLabel: 'Call 1930 & Freeze Accounts'
                },
                {
                  id: 'upi-pin-rejected',
                  choiceText: 'No (Refused PIN Entry)',
                  label: 'SAVED: Scam Thwarted by Golden Rule',
                  description: 'You remembered that receiving money never requires a PIN. Decline the collect request and report the buyer account to the marketplace.',
                  type: 'safe',
                  tip: 'Share only your UPI ID (VPA) or phone number; genuine buyers can transfer directly without any action from you.',
                  actionType: 'none'
                }
              ]
            },
            {
              id: 'upi-direct-credit',
              choiceText: 'No (Direct VPA Transfer)',
              label: 'NORMAL: Verify Inside Banking App',
              description: 'Sender used direct UPI ID. Do not trust external WhatsApp SMS screenshots; always check your actual balance inside your official bank app.',
              type: 'safe',
              tip: 'Never click links in SMS claiming your balance has been updated.',
              actionType: 'none'
            }
          ]
        }
      ]
    }
  },
  {
    id: 'flow-electricity-apk',
    title: 'Urgent Power Disconnection & Fake Discom APK',
    subtitle: 'Decision matrix for 9:30 PM power cutoff warnings and remote support apps',
    category: 'Remote Apps & APKs',
    badge: 'Device Security',
    summary: 'Step-by-step triage when receiving SMS threats about electricity meter disconnection or demands to install support utilities.',
    root: {
      id: 'apk-root',
      label: 'SMS Warning: "Power Supply Disconnected at 9:30 PM"',
      description: 'SMS claims previous bill unpaid, instructing to immediately dial a 10-digit mobile number or click a link.',
      type: 'root',
      tip: 'State Discoms (BESCOM, BSES, TPDDL, etc.) NEVER send personal 10-digit mobile numbers or disconnect electricity at night.',
      children: [
        {
          id: 'apk-call-check',
          choiceText: 'Called or Clicked Link',
          label: 'Agent Directed Installing an App / Sideloaded File?',
          description: 'Fake electricity officer says: "Please install our official support app or AnyDesk/QuickSupport to update meter record in 2 minutes."',
          type: 'decision',
          children: [
            {
              id: 'apk-installed-check',
              choiceText: 'Yes (App Promoted)',
              label: 'Did You Install APK or Approve Screen Mirroring?',
              description: 'Approved "Install Unknown Apps" or granted Accessibility / Screen sharing permissions to AnyDesk or TeamViewer.',
              type: 'decision',
              children: [
                {
                  id: 'apk-compromise-critical',
                  choiceText: 'Yes (Installed/Granted)',
                  label: 'CRITICAL: Phone Under Attacker Remote Control',
                  description: 'TURN ON AIRPLANE MODE IMMEDIATELY! Disconnect Wi-Fi to stop remote screen streaming. From another device, call bank to freeze net banking and reset UPI PINs.',
                  type: 'critical',
                  tip: 'Uninstall the rogue app while in Airplane Mode, or perform a factory reset after backing up photos.',
                  callShortcut: 'tel:1930',
                  actionType: 'sos',
                  actionLabel: 'Call Bank & Freeze NetBanking'
                },
                {
                  id: 'apk-rejected-safe',
                  choiceText: 'No (Refused Installation)',
                  label: 'SAFE: Trojan Dropper Blocked',
                  description: 'You refused to sideload APKs. Verify your actual bill balance on the official state electricity portal (or BBPS). Block the scammer number.',
                  type: 'safe',
                  tip: 'Discoms require formal written statutory disconnection notices before any service termination.',
                  actionType: 'none'
                }
              ]
            },
            {
              id: 'apk-web-only',
              choiceText: 'No (Visited Link Only)',
              label: 'CAUTION: Close Tab & Clear Cookies',
              description: 'If you only opened the webpage without typing card credentials, passwords, or downloading files, you are safe. Close browser tab.',
              type: 'caution',
              tip: 'Never enter Debit Card CVV or ATM PIN on unverified portals.',
              actionType: 'none'
            }
          ]
        },
        {
          id: 'apk-ignored-safe',
          choiceText: 'Ignored Fake SMS',
          label: 'AVERTED: Phishing Discarded',
          description: 'Recognized 10-digit mobile sender as fraudulent. Report message on Chakshu portal (sancharsaathi.gov.in) to blacklist sender SIM.',
          type: 'safe',
          tip: 'Official utility notifications always feature 6-character sender headers like AD-BESCOM or VM-BSESDL.',
          actionType: 'none'
        }
      ]
    }
  },
  {
    id: 'flow-telegram-tasks',
    title: 'Part-Time Job & Prepaid Merchant Task Escalation',
    subtitle: 'Decision matrix for YouTube like jobs, hotel rating tasks, and crypto deposit groups',
    category: 'Job & Task',
    badge: 'Ponzi Hook',
    summary: 'Recognize the transition from small ₹150 bait payouts to multi-lakh frozen merchant balance traps.',
    root: {
      id: 'task-root',
      label: 'Offered ₹150 for Liking YouTube Videos / Rating Hotels',
      description: 'Unsolicited WhatsApp message offering flexible part-time earnings for simple online rating tasks.',
      type: 'root',
      tip: 'Remember: Real companies NEVER pay strangers to like YouTube videos, and genuine jobs NEVER require you to pay money to work.',
      children: [
        {
          id: 'task-bait-check',
          choiceText: 'Completed Level 1 Task',
          label: 'Received Initial Small Payout (₹150 - ₹500)?',
          description: 'Coordinator promptly transfers ₹150 to your UPI to build absolute trust, then invites you to a Telegram VIP group.',
          type: 'decision',
          children: [
            {
              id: 'task-prepaid-check',
              choiceText: 'Yes (Bait Received)',
              label: 'Demanded "Prepaid Recharge" to Unlock Next Earnings?',
              description: 'Telegram coordinator introduces "Prepaid Merchant Tasks": transfer ₹2,000 to get ₹2,800, or transfer ₹10,000 for ₹14,000.',
              type: 'decision',
              children: [
                {
                  id: 'task-error-lock',
                  choiceText: 'Yes (Money Deposited)',
                  label: 'CRITICAL: Sunk-Cost Extortion Trap',
                  description: 'STOP PAYING IMMEDIATELY! Coordinator claims you made a "code error" and demands ₹50,000 to unlock your funds. No money will EVER be returned.',
                  type: 'critical',
                  tip: 'Preserve Telegram chat export, payment UTRs, and caller UPI IDs. Call 1930 immediately to freeze recipient mule accounts.',
                  callShortcut: 'tel:1930',
                  actionType: 'sos',
                  actionLabel: 'Report to 1930 Helpline'
                },
                {
                  id: 'task-stopped-safe',
                  choiceText: 'No (Refused to Deposit)',
                  label: 'SAVED: Kept Bait & Blocked Scammers',
                  description: 'You recognized that paying money to receive work is 100% fraudulent. Exit Telegram group and block coordinator.',
                  type: 'safe',
                  tip: 'Change Telegram privacy: Settings -> Privacy -> Groups -> My Contacts Only.',
                  actionType: 'none'
                }
              ]
            }
          ]
        },
        {
          id: 'task-ignored-safe',
          choiceText: 'Ignored Job Offer',
          label: 'AVERTED: Unsolicited Offer Rejected',
          description: 'Recognized international country codes (+84, +62, +234, +44) on WhatsApp as recruiter bots.',
          type: 'safe',
          tip: 'Report WhatsApp business account as spam.',
          actionType: 'none'
        }
      ]
    }
  },
  {
    id: 'flow-sextortion',
    title: 'Sextortion & Private Video Call Blackmail Crisis',
    subtitle: 'Decision matrix for morphed photo threats, WhatsApp video traps, and reputation ransom',
    category: 'Blackmail Protection',
    badge: 'Confidential Defense',
    summary: 'Psychological grounding and statutory legal procedures to de-escalate extortion and protect privacy.',
    root: {
      id: 'se-root',
      label: 'Blackmailer Threatens Leaking Intimate Video to Contacts',
      description: 'Bombarded with terrifying screenshots showing your face and claims your video will go viral on Facebook/YouTube in 15 minutes unless you pay.',
      type: 'root',
      tip: 'Crucial Truth: Paying NEVER stops the blackmail. If you pay ₹10,000, they will demand ₹30,000 within 1 hour. Extortionists only seek money, not posting videos.',
      children: [
        {
          id: 'se-paid-check',
          choiceText: 'Demands Received',
          label: 'Did You Transfer Any Money to Blackmailer?',
          description: 'Victim under extreme panic considers transferring ₹5,000 - ₹20,000 to settle.',
          type: 'decision',
          children: [
            {
              id: 'se-transferred-yes',
              choiceText: 'Yes (Paid Initial Demand)',
              label: 'CRITICAL: Sever Contact & Cut Off Extortion',
              description: 'DO NOT SEND A SINGLE RUPEE MORE! Block blackmailer on WhatsApp & calls. Partner scammers will call posing as "Delhi Cyber Cell Inspector" demanding deletion fees—THESE ARE THE SAME SCAMMERS.',
              type: 'critical',
              tip: 'Under BNS 308/351 and IT Act 66E/67, you are the protected victim. File confidential complaint on cybercrime.gov.in or Women Helpline 1090.',
              callShortcut: 'tel:1930',
              actionType: 'sos',
              actionLabel: 'Call 1930 / Women Helpline 1090'
            },
            {
              id: 'se-transferred-no',
              choiceText: 'No (Did Not Pay)',
              label: 'PROTECTED: Block, Fortress Privacy & Hash Media',
              description: 'Make Facebook and Instagram private. Block contact immediately. Submit cryptographic media hashes to StopNCII.org to automatically block platform uploads.',
              type: 'safe',
              tip: 'Extortionists operate on volume. When victims refuse to negotiate or pay, criminals abandon the target within hours.',
              actionType: 'evidence',
              actionLabel: 'Preserve Chats in Evidence Locker'
            }
          ]
        }
      ]
    }
  }
];

interface FraudDecisionFlowchartProps {
  onOpenSos: () => void;
  onOpenMitigationPlan?: (scenarioId?: string) => void;
}

export const FraudDecisionFlowchart: React.FC<FraudDecisionFlowchartProps> = ({
  onOpenSos,
  onOpenMitigationPlan
}) => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [selectedNode, setSelectedNode] = useState<FlowchartNodeData | null>(null);
  const [activePathNodeIds, setActivePathNodeIds] = useState<string[]>([]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isInteractiveMode, setIsInteractiveMode] = useState<boolean>(false);
  const [interactiveHistory, setInteractiveHistory] = useState<FlowchartNodeData[]>([]);

  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const scenario = SCENARIO_FLOWCHARTS[selectedScenarioIndex];

  // Helper to find a node by ID in tree
  const findNodeById = (root: FlowchartNodeData, id: string): FlowchartNodeData | null => {
    if (root.id === id) return root;
    if (root.children) {
      for (const child of root.children) {
        const found = findNodeById(child, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper to calculate ancestor path IDs
  const getPathToNode = (root: FlowchartNodeData, targetId: string): string[] => {
    const path: string[] = [];
    const dfs = (curr: FlowchartNodeData): boolean => {
      path.push(curr.id);
      if (curr.id === targetId) return true;
      if (curr.children) {
        for (const child of curr.children) {
          if (dfs(child)) return true;
        }
      }
      path.pop();
      return false;
    };
    dfs(root);
    return path;
  };

  // Reset when scenario changes
  useEffect(() => {
    setSelectedNode(scenario.root);
    setActivePathNodeIds([scenario.root.id]);
    setIsInteractiveMode(false);
    setInteractiveHistory([scenario.root]);
  }, [selectedScenarioIndex]);

  // Handle selecting a node (from SVG click or step choice)
  const handleSelectNode = (node: FlowchartNodeData) => {
    setSelectedNode(node);
    const path = getPathToNode(scenario.root, node.id);
    setActivePathNodeIds(path);
  };

  // D3 Tree Rendering Engine
  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;

    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);

    // Clean previous render
    g.selectAll('*').remove();

    // Responsive dimensions
    const width = 840;
    const height = 480;

    // Create D3 Hierarchy & Layout
    const hierarchyData = d3.hierarchy<FlowchartNodeData>(scenario.root);

    // Tree layout configuration (horizontal flow: left to right)
    const treeLayout = d3
      .tree<FlowchartNodeData>()
      .size([height - 120, width - 260])
      .separation((a, b) => (a.parent === b.parent ? 1.4 : 1.8));

    const rootNode = treeLayout(hierarchyData);

    // Zoom setup
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2.2])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoomLevel(Math.round(event.transform.k * 100) / 100);
      });

    svg.call(zoom);
    zoomBehaviorRef.current = zoom;

    // Initial transform offset
    const initialTransform = d3.zoomIdentity.translate(80, 50).scale(0.85);
    svg.call(zoom.transform, initialTransform);

    // Render Connector Links (Curved Beziers)
    const links = rootNode.links();

    // Link curves generator
    const linkGenerator = d3
      .linkHorizontal<d3.HierarchyPointLink<FlowchartNodeData>, d3.HierarchyPointNode<FlowchartNodeData>>()
      .x((d) => d.y)
      .y((d) => d.x);

    // Draw paths
    const linkGroup = g.append('g').attr('class', 'links');

    linkGroup
      .selectAll('path.link-base')
      .data(links)
      .enter()
      .append('path')
      .attr('class', 'link-base')
      .attr('d', (d) => linkGenerator(d) || '')
      .attr('fill', 'none')
      .attr('stroke', (d) => {
        const isTargetInPath = activePathNodeIds.includes(d.target.data.id);
        const isSourceInPath = activePathNodeIds.includes(d.source.data.id);
        if (isSourceInPath && isTargetInPath) {
          if (d.target.data.type === 'critical') return '#f43f5e';
          if (d.target.data.type === 'safe') return '#10b981';
          return '#6366f1';
        }
        return '#cbd5e1';
      })
      .attr('stroke-width', (d) => {
        const isTargetInPath = activePathNodeIds.includes(d.target.data.id);
        const isSourceInPath = activePathNodeIds.includes(d.source.data.id);
        return isSourceInPath && isTargetInPath ? 3.5 : 2;
      })
      .attr('stroke-dasharray', (d) => {
        const isTargetInPath = activePathNodeIds.includes(d.target.data.id);
        const isSourceInPath = activePathNodeIds.includes(d.source.data.id);
        return isSourceInPath && isTargetInPath ? 'none' : '4,4';
      })
      .attr('opacity', (d) => {
        const isTargetInPath = activePathNodeIds.includes(d.target.data.id);
        const isSourceInPath = activePathNodeIds.includes(d.source.data.id);
        return isSourceInPath && isTargetInPath ? 1 : 0.6;
      });

    // Draw Edge Labels (Choice Text: e.g. "YES", "NO", "QR CODE SENT")
    linkGroup
      .selectAll('g.edge-label')
      .data(links.filter((l) => l.target.data.choiceText))
      .enter()
      .append('g')
      .attr('class', 'edge-label')
      .attr('transform', (d) => {
        const midX = (d.source.y + d.target.y) / 2;
        const midY = (d.source.x + d.target.x) / 2 - 8;
        return `translate(${midX}, ${midY})`;
      })
      .each(function (d) {
        const gLabel = d3.select(this);
        const text = d.target.data.choiceText || '';
        const isChosen = activePathNodeIds.includes(d.target.data.id);

        const padX = 8;
        const widthEst = text.length * 6.5 + padX * 2;

        gLabel
          .append('rect')
          .attr('x', -widthEst / 2)
          .attr('y', -9)
          .attr('width', widthEst)
          .attr('height', 18)
          .attr('rx', 6)
          .attr('fill', isChosen ? '#1e1b4b' : '#f8fafc')
          .attr('stroke', isChosen ? '#818cf8' : '#cbd5e1')
          .attr('stroke-width', 1.2);

        gLabel
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', 3.5)
          .attr('fill', isChosen ? '#e0e7ff' : '#475569')
          .attr('font-size', '10px')
          .attr('font-weight', '700')
          .attr('font-family', 'ui-monospace, monospace')
          .text(text);
      });

    // Render Nodes (Interactive SVG Cards)
    const nodeGroup = g.append('g').attr('class', 'nodes');

    const nodeWidth = 190;
    const nodeHeight = 68;

    const nodeEnter = nodeGroup
      .selectAll('g.node')
      .data(rootNode.descendants())
      .enter()
      .append('g')
      .attr('class', 'node cursor-pointer')
      .attr('transform', (d) => `translate(${d.y}, ${d.x})`)
      .on('click', (_event, d) => {
        handleSelectNode(d.data);
      });

    // Node Box Rectangles
    nodeEnter
      .append('rect')
      .attr('x', -nodeWidth / 2)
      .attr('y', -nodeHeight / 2)
      .attr('width', nodeWidth)
      .attr('height', nodeHeight)
      .attr('rx', 14)
      .attr('fill', (d) => {
        const isSelected = selectedNode?.id === d.data.id;
        const isInPath = activePathNodeIds.includes(d.data.id);

        if (d.data.type === 'root') return isInPath ? '#0f172a' : '#1e293b';
        if (d.data.type === 'critical') return isSelected ? '#881337' : '#fff1f2';
        if (d.data.type === 'safe') return isSelected ? '#064e3b' : '#ecfdf5';
        if (d.data.type === 'caution') return isSelected ? '#78350f' : '#fffbeb';
        return isSelected ? '#312e81' : '#f8fafc';
      })
      .attr('stroke', (d) => {
        const isSelected = selectedNode?.id === d.data.id;
        const isInPath = activePathNodeIds.includes(d.data.id);

        if (isSelected) return '#f59e0b'; // golden active ring
        if (d.data.type === 'root') return '#6366f1';
        if (d.data.type === 'critical') return isInPath ? '#f43f5e' : '#fda4af';
        if (d.data.type === 'safe') return isInPath ? '#10b981' : '#6ee7b7';
        if (d.data.type === 'caution') return isInPath ? '#f59e0b' : '#fcd34d';
        return isInPath ? '#6366f1' : '#cbd5e1';
      })
      .attr('stroke-width', (d) => {
        return selectedNode?.id === d.data.id ? 3 : activePathNodeIds.includes(d.data.id) ? 2.2 : 1.5;
      })
      .attr('filter', (d) => (selectedNode?.id === d.data.id ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' : 'none'));

    // Node Type Pill / Icon Header
    nodeEnter
      .append('rect')
      .attr('x', -nodeWidth / 2 + 10)
      .attr('y', -nodeHeight / 2 + 8)
      .attr('width', 18)
      .attr('height', 18)
      .attr('rx', 5)
      .attr('fill', (d) => {
        if (d.data.type === 'root') return '#6366f1';
        if (d.data.type === 'critical') return '#e11d48';
        if (d.data.type === 'safe') return '#059669';
        if (d.data.type === 'caution') return '#d97706';
        return '#4f46e5';
      });

    // Icon Symbols inside pill
    nodeEnter
      .append('text')
      .attr('x', -nodeWidth / 2 + 19)
      .attr('y', -nodeHeight / 2 + 20)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', '11px')
      .attr('font-weight', '900')
      .text((d) => {
        if (d.data.type === 'root') return '⚡';
        if (d.data.type === 'critical') return '!';
        if (d.data.type === 'safe') return '✓';
        if (d.data.type === 'caution') return '⚠️';
        return '?';
      });

    // Node Badge Tag Text
    nodeEnter
      .append('text')
      .attr('x', -nodeWidth / 2 + 34)
      .attr('y', -nodeHeight / 2 + 20)
      .attr('fill', (d) => {
        const isSelected = selectedNode?.id === d.data.id;
        if (d.data.type === 'root') return '#c7d2fe';
        if (d.data.type === 'critical') return isSelected ? '#fecdd3' : '#9f1239';
        if (d.data.type === 'safe') return isSelected ? '#a7f3d0' : '#065f46';
        if (d.data.type === 'caution') return isSelected ? '#fde68a' : '#92400e';
        return isSelected ? '#c7d2fe' : '#4338ca';
      })
      .attr('font-size', '9px')
      .attr('font-weight', '700')
      .attr('text-transform', 'uppercase')
      .text((d) => {
        if (d.data.type === 'root') return 'TRIGGER';
        if (d.data.type === 'critical') return 'CRITICAL EMERGENCY';
        if (d.data.type === 'safe') return 'SAFE / AVERTED';
        if (d.data.type === 'caution') return 'CAUTION NEEDED';
        return 'CHECKPOINT';
      });

    // Node Title Text (Wrapped into 2 lines if needed)
    nodeEnter.each(function (d) {
      const gThis = d3.select(this);
      const isSelected = selectedNode?.id === d.data.id;
      const isDark =
        d.data.type === 'root' ||
        (isSelected && (d.data.type === 'critical' || d.data.type === 'safe' || d.data.type === 'caution'));

      const textColor = isDark ? '#ffffff' : '#0f172a';
      const label = d.data.label;

      // Split or clip label
      const maxChars = 24;
      let line1 = label;
      let line2 = '';

      if (label.length > maxChars) {
        const spaceIdx = label.lastIndexOf(' ', maxChars);
        if (spaceIdx > 12) {
          line1 = label.substring(0, spaceIdx);
          line2 = label.substring(spaceIdx + 1);
        } else {
          line1 = label.substring(0, maxChars);
          line2 = label.substring(maxChars);
        }
        if (line2.length > maxChars) {
          line2 = line2.substring(0, maxChars - 2) + '...';
        }
      }

      gThis
        .append('text')
        .attr('x', -nodeWidth / 2 + 10)
        .attr('y', line2 ? -nodeHeight / 2 + 37 : -nodeHeight / 2 + 44)
        .attr('fill', textColor)
        .attr('font-size', '11px')
        .attr('font-weight', '700')
        .attr('font-family', 'system-ui, sans-serif')
        .text(line1);

      if (line2) {
        gThis
          .append('text')
          .attr('x', -nodeWidth / 2 + 10)
          .attr('y', -nodeHeight / 2 + 50)
          .attr('fill', textColor)
          .attr('font-size', '10.5px')
          .attr('font-weight', '700')
          .attr('font-family', 'system-ui, sans-serif')
          .text(line2);
      }
    });
  }, [scenario, selectedNode, activePathNodeIds]);

  // Zoom Control Handlers
  const handleZoomIn = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(250).call(zoomBehaviorRef.current.scaleBy, 1.25);
  };

  const handleZoomOut = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(250).call(zoomBehaviorRef.current.scaleBy, 0.8);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    const initialTransform = d3.zoomIdentity.translate(80, 50).scale(0.85);
    d3.select(svgRef.current).transition().duration(350).call(zoomBehaviorRef.current.transform, initialTransform);
  };

  // Step-by-Step Simulator Mode Handlers
  const handleStepChoice = (child: FlowchartNodeData) => {
    handleSelectNode(child);
    setInteractiveHistory((prev) => [...prev, child]);
  };

  const handleStepBack = () => {
    if (interactiveHistory.length <= 1) return;
    const nextHistory = interactiveHistory.slice(0, -1);
    setInteractiveHistory(nextHistory);
    const prevNode = nextHistory[nextHistory.length - 1];
    handleSelectNode(prevNode);
  };

  const handleRestartStepWalkthrough = () => {
    handleSelectNode(scenario.root);
    setInteractiveHistory([scenario.root]);
  };

  const activeNode = selectedNode || scenario.root;
  const isTerminalNode = !activeNode.children || activeNode.children.length === 0;

  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 bg-slate-900 text-white relative overflow-hidden">
        {/* Decorative Grid Glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold mb-3">
            <GitFork className="w-3.5 h-3.5" />
            <span>D3 Interactive Decision Trees &amp; Crisis Navigation</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Scam Incident Decision Flowcharts
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Step-by-step branching decision maps. Trace what happened in an encounter to uncover critical counter-moves, identify whether you are in immediate financial jeopardy, and execute the exact protocol to secure your accounts.
          </p>
        </div>

        {/* Scenario Carousel Pills */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {SCENARIO_FLOWCHARTS.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => setSelectedScenarioIndex(idx)}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                selectedScenarioIndex === idx
                  ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span>{sc.title.split('/')[0].trim()}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  selectedScenarioIndex === idx ? 'bg-indigo-900/80 text-amber-300' : 'bg-slate-900 text-slate-400'
                }`}
              >
                {sc.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Scenario Briefing Card & Mode Toggle */}
      <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <span>{scenario.title}</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px]">
              {scenario.category}
            </span>
          </div>
          <p className="text-slate-600">{scenario.summary}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsInteractiveMode(!isInteractiveMode)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
              isInteractiveMode
                ? 'bg-indigo-600 text-white shadow-indigo-200'
                : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{isInteractiveMode ? 'Switch to Full Diagram' : 'Guided Decision Stepper'}</span>
          </button>
        </div>
      </div>

      {/* D3 Diagram Canvas / Guided Stepper View */}
      <div className="relative bg-slate-950 min-h-[460px] overflow-hidden">
        {/* Floating Canvas Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl text-white text-xs">
          <button
            onClick={handleZoomIn}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Reset Diagram"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <span className="px-2 py-0.5 font-mono text-[10px] text-slate-400 border-l border-slate-800">
            {Math.round(zoomLevel * 100)}%
          </span>
        </div>

        {/* Legend Overlay */}
        <div className="absolute top-4 left-4 z-20 hidden md:flex items-center gap-3 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span>Trigger Point</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span>Decision Node</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Safe / Mitigated</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Critical Emergency</span>
          </div>
        </div>

        {/* The D3 SVG Viewport */}
        <svg
          ref={svgRef}
          className="w-full h-[460px] cursor-grab active:cursor-grabbing block"
          viewBox="0 0 840 480"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="activeLinkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <pattern id="gridPattern" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#1e293b" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridPattern)" />
          <g ref={gRef} />
        </svg>

        {/* Guided Step-by-Step Interactive Stepper Overlay (when toggled) */}
        {isInteractiveMode && (
          <div className="absolute inset-0 bg-slate-950/92 backdrop-blur-sm z-30 p-5 sm:p-8 flex flex-col justify-between overflow-y-auto animate-in fade-in">
            <div className="max-w-2xl mx-auto w-full space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono uppercase tracking-wider text-indigo-400 font-bold">
                  Guided Decision Step {interactiveHistory.length}
                </span>
                <button
                  onClick={() => setIsInteractiveMode(false)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  ✕ Close Stepper
                </button>
              </div>

              {/* Current Question / Checkpoint */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] ${
                      activeNode.type === 'critical'
                        ? 'bg-rose-500/20 text-rose-300'
                        : activeNode.type === 'safe'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-indigo-500/20 text-indigo-300'
                    }`}
                  >
                    {activeNode.type.toUpperCase()}
                  </span>
                  <span className="text-slate-400">Evaluating: {scenario.title}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold leading-snug">
                  {activeNode.label}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activeNode.description}
                </p>

                {activeNode.tip && (
                  <div className="p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-amber-300 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{activeNode.tip}</span>
                  </div>
                )}
              </div>

              {/* Step Choices or Terminal Verdict */}
              {!isTerminalNode ? (
                <div className="space-y-2">
                  <div className="text-xs text-slate-400 font-semibold mb-2">
                    What occurred in your specific encounter? Select the path:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeNode.children?.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => handleStepChoice(child)}
                        className="p-4 rounded-xl bg-slate-900 hover:bg-indigo-950/80 border border-slate-800 hover:border-indigo-500 text-left transition-all cursor-pointer group flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="text-xs font-mono font-bold text-indigo-400 group-hover:text-indigo-300">
                            {child.choiceText || 'Next Step'}
                          </div>
                          <div className="text-sm font-bold text-white group-hover:text-indigo-200">
                            {child.label}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 border border-indigo-500/40 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Decision Path Reached Final Assessment</span>
                  </div>
                  <h4 className="text-base font-bold text-white">
                    {activeNode.type === 'critical'
                      ? '⚠️ Critical Incident Mitigation Mandatory'
                      : '✅ Incident Secured / Risk Contained'}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Review the tactical action plan below to execute necessary precautions or statutory reports.
                  </p>
                </div>
              )}
            </div>

            {/* Stepper Footer Controls */}
            <div className="max-w-2xl mx-auto w-full pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={handleRestartStepWalkthrough}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart Stepper</span>
              </button>

              <div className="flex items-center gap-2">
                {interactiveHistory.length > 1 && (
                  <button
                    onClick={handleStepBack}
                    className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-800 cursor-pointer"
                  >
                    Back 1 Step
                  </button>
                )}
                <button
                  onClick={() => setIsInteractiveMode(false)}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold cursor-pointer"
                >
                  View on Diagram
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selected Node Triage Detail Drawer */}
      <div className="p-5 sm:p-6 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                  activeNode.type === 'critical'
                    ? 'bg-rose-100 text-rose-700 border border-rose-200'
                    : activeNode.type === 'safe'
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : activeNode.type === 'caution'
                    ? 'bg-amber-100 text-amber-700 border border-amber-200'
                    : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                }`}
              >
                {activeNode.type === 'critical' ? (
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                ) : activeNode.type === 'safe' ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                ) : activeNode.type === 'caution' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                ) : (
                  <GitFork className="w-5 h-5 text-indigo-600" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-500">
                    Active Node Assessment
                  </span>
                  <span
                    className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                      activeNode.type === 'critical'
                        ? 'bg-rose-600 text-white'
                        : activeNode.type === 'safe'
                        ? 'bg-emerald-600 text-white'
                        : activeNode.type === 'caution'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-900 text-white'
                    }`}
                  >
                    {activeNode.type === 'critical'
                      ? 'Action Required: Immediate Triage'
                      : activeNode.type === 'safe'
                      ? 'Secure: Threat Contained'
                      : activeNode.type === 'caution'
                      ? 'Attention: Audit Required'
                      : 'Scenario Origin'}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                  {activeNode.label}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 hidden sm:inline">
                Click any node on the diagram above to inspect alternative paths
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start text-xs sm:text-sm">
            {/* Narrative explanation */}
            <div className="md:col-span-8 space-y-2.5">
              <p className="text-slate-700 leading-relaxed font-medium">
                {activeNode.description}
              </p>

              {activeNode.tip && (
                <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-950 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{activeNode.tip}</span>
                </div>
              )}
            </div>

            {/* Quick Action Trigger Panel */}
            <div className="md:col-span-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Recommended Action
              </span>

              {activeNode.callShortcut ? (
                <a
                  href={activeNode.callShortcut}
                  className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{activeNode.actionLabel || 'Dial 1930 Helpline'}</span>
                </a>
              ) : null}

              {onOpenMitigationPlan && (
                <button
                  type="button"
                  onClick={() => onOpenMitigationPlan(scenario.id.replace('flow-', ''))}
                  className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>Open Step-by-Step Plan</span>
                </button>
              )}

              <button
                type="button"
                onClick={onOpenSos}
                className="w-full py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-300 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
                <span>View Emergency SOS Directory</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
