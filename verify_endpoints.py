import urllib.request
import urllib.error
import json

BASE_URL = "http://localhost:8000/api"

def make_request(url, data=None, headers=None, method="GET"):
    if headers is None:
        headers = {}
    
    req_data = None
    if data is not None:
        req_data = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"
        
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as res:
            return res.status, json.loads(res.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        try:
            body = json.loads(body)
        except:
            pass
        return e.code, body
    except Exception as e:
        return 0, str(e)

def test_integration():
    print("--- STARTING SYSTEM INTEGRATION TEST ---")
    
    # 1. Register a test user
    test_user = {
        "full_name": "Jane Doe",
        "email": "jane@ycn.com",
        "phone_number": "+919988776655",
        "password": "user123"
      }
    print("\n1. Registering test user 'jane@ycn.com'...")
    status, res = make_request(f"{BASE_URL}/auth/register", data=test_user, method="POST")
    if status == 400 and "already registered" in str(res):
        print("   -> Jane already registered. Proceeding.")
    elif status == 200:
        print(f"   -> Success! Member ID: {res['member_id']}")
    else:
        print(f"   -> Failed! Status: {status}, Response: {res}")
        return False

    # 2. Login User
    print("\n2. Logging in 'jane@ycn.com'...")
    status, res = make_request(f"{BASE_URL}/auth/login", data={"email": "jane@ycn.com", "password": "user123"}, method="POST")
    if status == 200:
        user_token = res["access_token"]
        print("   -> Success! JWT Token retrieved.")
    else:
        print(f"   -> Failed! Status: {status}, Response: {res}")
        return False

    user_headers = {"Authorization": f"Bearer {user_token}"}

    # 3. Retrieve Self
    print("\n3. Verifying '/auth/me' endpoint...")
    status, res = make_request(f"{BASE_URL}/auth/me", headers=user_headers)
    if status == 200:
        user_id = res["id"]
        print(f"   -> Success! Verified member {res['full_name']} (ID: {res['member_id']})")
    else:
        print(f"   -> Failed! Status: {status}, Response: {res}")
        return False

    # 4. Fetch Events List
    print("\n4. Fetching events list...")
    status, events = make_request(f"{BASE_URL}/events")
    if status == 200 and len(events) > 0:
        print(f"   -> Success! Found {len(events)} published events.")
        for ev in events:
            print(f"      - Event ID {ev['id']}: {ev['title']} ({ev['available_seats']} seats left)")
    else:
        print(f"   -> Failed to retrieve events list! Status: {status}, Response: {events}")
        return False

    # 5. Attempt Register for Private Event (Event ID 3) as Standard Member
    private_event = next((e for e in events if e.get("is_private")), None)
    if private_event:
        print(f"\n5. Attempting registration for Private Event '{private_event['title']}' as Standard Member...")
        status, res = make_request(f"{BASE_URL}/events/register/{private_event['id']}", headers=user_headers, method="POST")
        if status == 400 and "Private Event" in str(res):
            print("   -> Success! Access control correctly blocked non-premium member.")
        else:
            print(f"   -> Failed access control check! Status: {status}, Response: {res}")
            return False

    # 6. Upgrade Member to Premium VIP
    print("\n6. Upgrading member to Premium VIP...")
    status, upg_res = make_request(f"{BASE_URL}/users/upgrade-membership", headers=user_headers, method="POST")
    if status == 200 and upg_res["membership_tier"] == "premium":
        print(f"   -> Success! Upgraded {upg_res['full_name']} to Premium VIP.")
    else:
        print(f"   -> Failed membership upgrade! Status: {status}, Response: {upg_res}")
        return False

    # 7. Register for Event ID 2 with Automatic 15% Premium Discount
    summit = next((e for e in events if not e.get("is_private")), events[0])
    print(f"\n7. Registering Premium member for '{summit['title']}' with 15% VIP Discount...")
    reg_payload = {
        "event_id": summit["id"],
        "payment_method": "card",
        "full_name": "Jane Doe",
        "phone_number": "+919988776655"
    }
    status, res = make_request(f"{BASE_URL}/events/register/{summit['id']}", data=reg_payload, headers=user_headers, method="POST")
    if status == 200:
        print(f"   -> Success! Ticket booked. Paid: ${res['amount_paid']:.2f} (Base: ${res['ticket_price']:.2f}, 15% Disc: ${res['discount_applied']:.2f}). Ref: {res['payment_id']}")
    elif status == 400 and "already registered" in str(res):
        print("   -> Success! Duplicate check verified (Already registered).")
    else:
        print(f"   -> Failed! Status: {status}, Response: {res}")
        return False

    # 8. Register Premium Member for Private VIP Event (Event ID 3)
    if private_event:
        print(f"\n8. Registering Premium member for Private Event '{private_event['title']}'...")
        status, res = make_request(f"{BASE_URL}/events/register/{private_event['id']}", data=reg_payload, headers=user_headers, method="POST")
        if status == 200:
            print(f"   -> Success! VIP Ticket booked. Paid: ${res['amount_paid']:.2f} (Base: ${res['ticket_price']:.2f}, 15% Disc: ${res['discount_applied']:.2f}). Ref: {res['payment_id']}")
        elif status == 400 and "already registered" in str(res):
            print("   -> Success! Duplicate check verified (Already registered).")
        else:
            print(f"   -> Failed! Status: {status}, Response: {res}")
            return False

    # 6. Submit Recruitment Application
    rec_data = {
        "full_name": "Jane Doe",
        "email": "jane@ycn.com",
        "phone_number": "+919988776655",
        "college": "Stanford University",
        "department": "Interaction Design",
        "year": "2nd",
        "domain": "Design Team",
        "previous_experience": "Designed college newsletter 2025",
        "skills": "Framer, Photoshop, Figma, CSS",
        "portfolio_link": "https://jane.design",
        "github_link": "https://github.com/jane",
        "linkedin_link": "https://linkedin.com/in/jane",
        "explanation": "I love creating beautiful and interactive glassmorphic UI templates!"
    }
    print("\n6. Submitting recruitment application...")
    status, res = make_request(f"{BASE_URL}/recruitment/apply", data=rec_data, headers=user_headers, method="POST")
    if status == 200:
        print(f"   -> Success! Application status: {res['status']}")
    elif status == 400 and "already applied" in str(res):
        print("   -> Success! Duplicate recruitment check verified.")
    else:
        print(f"   -> Failed! Status: {status}, Response: {res}")
        return False

    # 7. Login as Admin
    print("\n7. Logging in as Administrator...")
    status, res = make_request(f"{BASE_URL}/auth/login", data={"email": "admin@ycn.com", "password": "admin123"}, method="POST")
    if status == 200:
        admin_token = res["access_token"]
        print("   -> Success! Admin authenticated.")
    else:
        print(f"   -> Failed! Status: {status}, Response: {res}")
        return False

    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # 8. Check Admin Dashboard Metrics
    print("\n8. Verifying Admin dashboard analytics metrics...")
    status, res = make_request(f"{BASE_URL}/admin/dashboard", headers=admin_headers)
    if status == 200:
        print("   -> Success! Retrieved operational counts:")
        print(f"      - Total members: {res['total_members']}")
        print(f"      - Total events: {res['total_events']}")
        print(f"      - Booked registrations: {res['total_registrations']}")
        print(f"      - Recruitment domain data points: {list(res['domain_recruitment'].keys())}")
    else:
        print(f"   -> Failed! Status: {status}, Response: {res}")
        return False

    print("\n--- ALL BACKEND INTEGRATION TESTS COMPLETED SUCCESSFULLY ---")
    return True

if __name__ == "__main__":
    test_integration()
