---
title: "WTF is Terraform and why Infrastructure as Code matters? "
date: "2026-01-27"
description: "An introduction to Terraform and Infrastructure as Code. Part one of two part series."
tags: ["DevOps", "IaC", "Medium Archive"]
category: "Engineering"
canonical: "https://blog.navadeepnaidu.com/blog/WTF-is-Terraform-part-one"
draft: false
---

Terraform is an Infrastructure as Code tool for defining and managing cloud infrastructure. This article focuses on why such a tool became necessary and problems it was designed to solve.

### Who should read this?

This article is written for:

- Students learning cloud or DevOps fundamentals
- engineers who have used AWS, Azure or any cloud platform at least once
- anyone who has manually created cloud resources and wondered if there’s a better way

You don’t need prior experience with Terraform.

You *should* be comfortable with basic ideas like servers, networks and cloud in general. If you’ve launched an EC2 instance or created a DB from a cloud console you are ready.

This article explains **what Terraform is and why it exists**, without diving into internals yet. A deeper technical breakdown will follow in the next part.

---

## The problem Terraform is trying to solve

Infrastructure rarely starts complicated.

At the beginning, someone logs into a cloud dashboard, create a server, opens a few ports, and things work. That approach feels productive because it is fast and hands on visual thing. The main trouble begins when the system grows.

Over time, infra becomes a collection of manual decisions like,

\> A firewall rule added to “fix something quickly”

\> A server configured slightly differently from others

\> A permission changed directly in prod

None of this is documented in a reliable way. The cloud console shows **what** exists, but not ***why*** it exists or ***how*** it got there.

When something breaks, we often discover that no one fully understands the system anymore. Infrastructure becomes fragile and changes now become risky or straight up unpredictable.

Terraform exists because this pattern repeats everywhere.

---

## Why scripts and cloud CLIs fall short

The next logical step is automation. Instead of clicking buttons, us engineers write shell scripts or use cloud CLIs. This removes some manual work but does not solve the core problem.

A script usually describes a sequence of actions. let’s say create a server, open port 22, attach a security group etc. These steps are executed in the exact order they are written. The automation is fixed to that sequence.

The problem is that the script has no understanding of the system’s current state or the intended end result. It cannot answer basic questions like Does this server already exist? Is the configuration still correct? What happens if one step fails halfway through the run?

![script-automation.png](script-automation.png)

Because scripts operate step by step, scripts assume a clean starting point every time. They do not know what they created yesterday, what was changed manually in production or whether the infrastructure already matches what you want. Running the same script multiple times can create duplicate resources, fail or just turn the system into an inconsistent state.

This kind of automation does not remove uncertainty that we are dealing with. Without context or memory, automation is still fragile.

---

## Infrastructure as Code: the actual idea

Infrastructure as Code treats infrastructure like software. You define it in files, commit those files to your version control and review changes before applying them.

This makes infrastructure reproducible. Teams share a single source of truth. New environments can be created instantly and are all consistent and reliable. When something breaks you have history to go back and fix. Terraform provides an implementation of these ideas.

---

## What Terraform does differently

Terraform takes a declarative approach. Instead of telling the system ***how*** to create infrastructure step by step, you describe ***what the final infrastructure should look like***. You define the desired state and it figures out how to reach it.

Terraform compares what you want with what actually exists and executes the difference. Only the required changes are applied.

This is why Terraform scales better than scripts as systems grow.

![what-terraform-does.png](what-terraform-does.png)

### State: how Terraform keeps track

Infrastructure exists outside your code, so Terraform needs a way to remember what it has already created and how those resources relate to the configuration you write. Terraform solves this using "state".

State is a structured record that maps resources defined in Terraform configuration to actual infrastructure objects in the cloud. By consulting state Terraform can determine 

\> whether a resource already exists

\> whether it was modified outside of Terraform

\> what actions are required to bring the system back in line with the given configuration.

A simple example makes this more clear. Let’s say your configuration defines a single VM. On the first run Terraform creates it and records that resource in state. On the next run, Terraform checks state, sees that the virtual machine already exists, and does nothing. Without state, Terraform would have no memory of the previous run and might attempt to create a second duplicate virtual machine instead.

You don’t need to understand state in detail yet we will cover that in the next article but it’s important to know that Terraform is not operating blindly. State is how Terraform maintains context across runs.

---

## When Terraform makes sense

Terraform is a good fit when you want your infra to be:

\> Predictable across environments

\> Easy to review and reproduce

\> Managed by teams, not individuals

Some common use cases where Terraform is used:

1. Cloud networks and subnets
2. VMs and load balancers
3. DBs and storage
4. Kubernetes clusters and other cloud services

---

## When Terraform is not the right tool

Terraform is not made to manage everything.

Terraform is not meant for deploying applications or managing frequent runtime changes. It works best when infrastructure changes are planned and controlled, not when system behavior needs constant adjustment.

In practice, Terraform rarely stands alone. It defines *what infrastructure should exist,* servers, networks, databases and permissions. Tools like **Ansible** is frequently paired with Terraform, where Terraform creates the infrastructure and Ansible takes configures it by installing software, managing services and applying OS level changes.

Observability tools like **Grafana** and **Prometheus** operate at a different layer. They do not create or configure infrastructure; they continuously observe it, providing visibility into how the system behaves over time.

Used together, these tools form a clear separation of concerns. Terraform defines structure, Ansible shapes behavior and observability tools provide feedback. 

---

## What comes next

This article focused on the **why** part behind Terraform. In the next part we will look at **how** Terraform actually works. 

You’ll get answers for questions like:

\> How state is stored and used

\> How Terraform builds execution graphs

\> How planning and reconciliation happen

\> Why Terraform behaves the way it does during failures

That deep dive focuses on understanding Terraform’s internal model.

---

## Suggested resources (optional)

If you want references while reading or after you can take a look on these resources. 

- [HashiCorp’s Terraform introduction (company that built Terraform)](https://developer.hashicorp.com/terraform/intro)
- ["Terraform explained in 15 mins" By Tech World with Nana (YouTube)](https://youtu.be/l5k1ai_GBDE?si=2Tx7-Cb9IIWxrvXd)

---