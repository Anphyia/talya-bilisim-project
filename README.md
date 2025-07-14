# Restaurant Booking Web Application

A full-stack application that enables users to reserve tables based on date, time slot, table type, and party size, with a user interface and an admin panel for reservation management.

---

## Project Overview

This project aims to ease restaurant table bookings through a responsive web app. Users can make reservations in just a few steps, while the restaurant staff can view, approve, or manage bookings through a dedicated dashboard.

---


## Objectives

- Eliminate manual phone reservations and errors
- Provide real-time table availability
- Help staff plan through reservation summaries
- Offer a seamless user experience for both guests and admins

---

## Target Users

- **Restaurant Guests**: Reserve a table anytime via the web interface  
- **Restaurant Admins/Managers**: Track and manage all reservations  
- **Hosts/Waiters**: View daily schedule and prepare accordingly  

---

## Core Functionalities

- **Date & Time Slot Selection**: Users choose a date and available period (breakfast, lunch, or dinner)  
- **Party Size Input**: Capacity check is based on the selected number of guests  
- **Table Type Options**: Garden, indoor, VIP, etc.  
- **Guest Information Form**: Name, phone, email, and optional notes  
- **Reservation Rules Consent**: Checkbox before submission  
- **Reservation Confirmation Page**  
- **Admin Dashboard**: View, approve or reject bookings by day or time slot  

---

## Functional Use Cases

| Actor     | Action                         | Outcome                          |
|-----------|--------------------------------|----------------------------------|
| Guest     | Creates reservation            | Entry marked as "pending"        |
| Admin     | Approves reservation           | Status changes to "confirmed"    |
| Guest     | Cancels reservation            | Reservation removed              |
| Admin     | Views daily reservations       | Filtered list displayed          |

---

## Non-Functional Requirements (NFRs)

- Should support up to **100 concurrent users**
- Reservation processing must complete in **< 2 seconds**
- **Mobile-responsive** UI
- **Basic authentication** for admin access
- **Spam protection** (planned)
- **Input validation** on both client and server side

---

## Data Models (Entities)

### Reservation
- `id`
- `date`
- `timeSlot` (breakfast/lunch/dinner)
- `guestName`
- `email`
- `phone`
- `partySize`
- `tableType` (indoor/garden/VIP)
- `specialRequest`
- `status` (pending, confirmed, rejected)

### Table *(Optional if needed)*
- `id`
- `type` (indoor, garden, VIP)
- `capacity`

### AdminUser
- `id`
- `username`
- `passwordHash`

---

## Constraints

- One reservation per table per time slot
- Table selection must match the required party size
- All required fields must be completed
- Admin actions are restricted to authenticated users

---

##  User Interaction Flow


```text

[1] Choose Date
↓
[2] Select Time Slot 
↓
[3] Enter Number of Guests
↓
[4] Choose Table Type 
↓
[5] Fill Contact Details & Special Requests
↓
[6] Accept Restaurant Policies
↓
[7] Submit Reservation
↓
[8] Admin Receives + Confirms or Rejects

```


---

##  Planned API Endpoints

| Method | Route                       | Purpose                       |
|--------|-----------------------------|-------------------------------|
| POST   | `/api/reservations`         | Create a new reservation      |
| GET    | `/api/reservations`         | Retrieve all reservations     |
| GET    | `/api/availability`         | Check available slots/tables  |
| PUT    | `/api/reservations/:id`     | Approve or update reservation |
| DELETE | `/api/reservations/:id`     | Cancel a reservation          |

---

## Security & Validation

- Required fields with frontend and backend validation  
- Email format and phone number checks  
- Input sanitisation (e.g., special requests)  
- Admin authentication (simple login or token-based)  
- A spam prevention mechanism (planned) 

---

## Development Roadmap

| Phase         | Tasks                                   |
|---------------|-----------------------------------------|
| **Phase 1**   | Build static UI & reservation form      |
| **Phase 2**   | Setup backend server & basic endpoints  |
| **Phase 3**   | Connect to database & validations       |
| **Phase 4**   | Admin panel & basic auth                |
| **Phase 5**   | Final testing & deployment              |

---

## Potential Improvements

- Email confirmation or SMS notification  
- QR code for reservation check-in  
- Table layout preview for admin  
- Multi-language support  

---


## ✅ Status

Currently in planning & analysis phase. All feature requirements are defined. Implementation begins next.
