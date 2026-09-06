---
title: "Active Directory Homelab"
tags: ['tech', 'Active Directory', 'Windows Server']
githubUrl: https://github.com/EliaGiolli/Active-Directory-Homelab
slug: active-directory-homelab
---

# 🖥️ Active Directory Homelab — `lab.lan`

A hands-on homelab where I built a small Active Directory environment from scratch — no templates, no automation scripts to begin with, just clicking through every screen myself and documenting what happened, including what broke along the way.

This repo is part of my learning path toward an IT Support / Junior Sysadmin role. The goal wasn't just to *have* a working domain, but to understand **why** each piece is configured the way it is, and to leave a trail that someone else (or future me) can follow and learn from.

---

## 🎯 Project goals — all complete

- Deploy a Windows Server VM as a Domain Controller (AD DS + DNS)
- Stand up a test domain (`lab.lan`)
- Design and create an OU structure (not a flat dump of users)
- Create users and groups organized by the OU structure
- Join a Windows client VM to the domain
- Implement realistic GPOs (password policy, drive mapping, client restriction)
- Verify end-to-end: domain user login from the client + GPO application
- Automate a representative slice of the manual work with PowerShell

This project is considered **done** relative to its original scope. The value here was in going through the full cycle — plan, build, break things, diagnose, fix, verify, automate — not in exhaustively covering every AD feature. See [What I'd explore next](#-what-id-explore-next-if-i-return-to-this) for optional ideas if this lab gets revisited.

---

## 🏗️ Architecture

| Machine | Role | OS | IP | DNS |
|---|---|---|---|---|
| **DC01** | Domain Controller / DNS Server | Windows Server 2025 Standard (Desktop Experience) | `10.10.10.10` (static) | `127.0.0.1` |
| **CL01** | Domain-joined client | Windows 10 Pro 22H2 | `10.10.10.50` (static) | `10.10.10.10` |
| Gateway | VMware NAT gateway | — | `10.10.10.2` | — |

![Network Topology](./diagrams/network-topology.svg)

Both VMs run on **VMware Workstation Pro**, connected through a dedicated NAT network (`VMnet8`, subnet `10.10.10.0/24`, DHCP disabled) — isolated from my home LAN but with outbound internet access for licensing activation and updates.

**Design decisions explained in detail in [`docs/01-planning.md`](docs/01-planning.md)**, including:
- why a NAT network instead of Bridged/Host-only
- why the DC needs a static IP
- why the client points to the DC (not a public resolver) for DNS
- why `lab.lan` instead of the more common `.local`

---

## 📁 Repository structure

```
ad-homelab/
├── README.md                      ← you are here
├── docs/
│   ├── 01-planning.md              Environment planning & network design
│   ├── 02-dc-installation.md       Building DC01: VM creation, OS install, hostname/IP config
│   ├── 03-adds-promotion.md        Installing AD DS role & promoting DC01 to a Domain Controller
│   ├── 04-ou-users-groups.md       OU structure, security groups, and domain users
│   ├── 05-client-join.md           Client prep, domain join, and post-join verification
│   ├── 06-gpo.md                   Group Policy Objects: password policy, drive mapping, restrictions
│   ├── 07-powershell-automation.md Scripting OU creation, GPO creation, and an environment health check
│   └── troubleshooting.md          ⭐ Every issue hit along the way — symptom → diagnosis → fix
├── screenshots/
│   ├── 01-planning/
│   ├── 02-dc-installation/
│   ├── 03-adds-promotion/
│   ├── 04-ou-users-groups/
│   ├── 05-client-join/
│   └── 06-gpo/
├── scripts/
│   ├── create-user.ps1             Bulk user creation + group assignment
│   ├── create-ou-structure.ps1     Idempotent OU hierarchy creation
│   ├── create-gpos.ps1             GPO creation + linking
│   └── health-check.ps1            Environment sanity check (services, OUs, groups, GPOs)
└── diagrams/
    └── network-topology.svg        Network topology diagram
```

---

## 🧰 Environment

- **Hypervisor:** VMware Workstation Pro (free for personal use)
- **Server OS:** Windows Server 2025 Standard Evaluation, Desktop Experience — 180-day evaluation, official Microsoft Evaluation Center
- **Client OS:** Windows 10 Pro 22H2, domain-joined to `lab.lan`
- **Networking:** VMware NAT (`VMnet8`), static IPs, DHCP disabled by design
- **Domain:** `lab.lan`, single forest / single domain, one Domain Controller
- **Directory structure:** a single root OU (`ContosoLab`) with department-based sub-OUs (IT, Finance, Sales, Management), dedicated OUs for security groups and computers
- **Group Policy:** 3 GPOs covering a domain-wide password policy, a department-scoped drive mapping, and a department-scoped restriction — each verified with a positive *and* negative control test
- **Automation:** PowerShell scripts for bulk user creation, OU structure creation, GPO creation/linking, and an environment health check

No cloud services, no paid licenses — the whole lab runs locally on a personal machine with 16 GB RAM.

---

## 🔐 Group Policy summary

| GPO | Linked to | Type | Verified by |
|---|---|---|---|
| `GPO-Password-Policy` | Domain (`lab.lan`) | Policy (Computer) | `gpresult` + rejected-weak-password test |
| `GPO-IT-DriveMapping` | OU `IT` | Preference (User) | `Z:` drive present for IT, absent for Sales |
| `GPO-Sales-RestrictControlPanel` | OU `Sales` | Policy (User) | Control Panel blocked for Sales, open for IT |

Full write-up in [`docs/06-gpo.md`](docs/06-gpo.md).

---

## 🔍 Highlights: things that went wrong (and what they taught me)

Troubleshooting is most of the actual learning in a project like this, so it gets its own file instead of being buried in a "steps" doc. 
A few highlights:

- Spent time debugging a VM that wouldn't boot from ISO — turned out I'd downloaded the *"Languages and Optional Features ISO"* instead of the actual installer, from a different link on the same Microsoft download page.
- Renamed the server via the wrong field (`Computer description` vs. the actual `Computer name`) and only caught it by re-verifying with `hostname` in PowerShell instead of trusting the GUI at face value.
- Discovered that after installing the AD DS role, a VM snapshot revert had silently reset it — caught via `Get-WindowsFeature`, fixed by reinstalling the role directly with PowerShell.
- Created two security groups in the wrong OU by right-clicking the wrong tree node — recovered with `Move...`, verified independently with `Get-ADGroup`.
- "Installed" VMware Tools that turned out not to be running at all — the host-side menu option only mounts the installer; running it inside the guest is a separate, manual step.
- After a two-month gap between sessions, a failed `ping`/`nslookup` from the client turned out to be simply the DC VM being powered off — the specific "Destination host unreachable" wording was the clue.
- The domain join left the client with its original hostname, sitting in AD's default `Computers` container instead of the intended `Workstations` OU — fixed the same way as the misplaced security groups.

The pattern across all of them: **verify state with a command instead of trusting what a wizard or dashboard appears to show.**



