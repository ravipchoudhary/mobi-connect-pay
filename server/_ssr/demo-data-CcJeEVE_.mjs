//#region node_modules/.nitro/vite/services/ssr/assets/demo-data-CcJeEVE_.js
var STORAGE_KEYS = {
	transactions: "mobi-connect-demo-transactions",
	notifications: "mobi-connect-demo-notifications",
	tickets: "mobi-connect-demo-tickets",
	apiKeys: "mobi-connect-demo-api-keys",
	permissions: "mobi-connect-demo-permissions",
	activity: "mobi-connect-demo-activity",
	dmt2Requests: "mobi-connect-demo-dmt2-requests"
};
var isBrowser = () => typeof window !== "undefined";
function readStorage(key, fallback) {
	if (!isBrowser()) return fallback;
	try {
		const raw = window.localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}
function writeStorage(key, value) {
	if (!isBrowser()) return;
	window.localStorage.setItem(key, JSON.stringify(value));
}
function seedIfNeeded() {
	if (readStorage(STORAGE_KEYS.transactions, []).length === 0) writeStorage(STORAGE_KEYS.transactions, [
		{
			id: crypto.randomUUID(),
			type: "Recharge",
			amount: 499,
			status: "Success",
			reference: "RCH-1042",
			customer: "Asha Sharma",
			createdAt: "2026-07-14T09:10:00Z",
			channel: "Mobile",
			note: "Jio prepaid top-up"
		},
		{
			id: crypto.randomUUID(),
			type: "BBPS",
			amount: 1280,
			status: "Pending",
			reference: "BPS-2041",
			customer: "Ravi Kumar",
			createdAt: "2026-07-14T08:40:00Z",
			channel: "Electricity",
			note: "Electricity bill"
		},
		{
			id: crypto.randomUUID(),
			type: "AEPS",
			amount: 2500,
			status: "Success",
			reference: "AEP-3051",
			customer: "Mona Das",
			createdAt: "2026-07-13T17:25:00Z",
			channel: "Cash Withdrawal",
			note: "Withdrawal"
		},
		{
			id: crypto.randomUUID(),
			type: "Transfer",
			amount: 15e3,
			status: "Success",
			reference: "TRF-4002",
			customer: "Self Transfer",
			createdAt: "2026-07-13T14:55:00Z",
			channel: "Wallet",
			note: "To commission wallet"
		},
		{
			id: crypto.randomUUID(),
			type: "Settlement",
			amount: 28e3,
			status: "Pending",
			reference: "STL-5109",
			customer: "Distributor Ops",
			createdAt: "2026-07-12T20:12:00Z",
			channel: "Bank",
			note: "Daily settlement"
		}
	]);
	if (readStorage(STORAGE_KEYS.notifications, []).length === 0) writeStorage(STORAGE_KEYS.notifications, [
		{
			id: crypto.randomUUID(),
			title: "KYC approved",
			message: "Your KYC was renewed successfully.",
			type: "kyc",
			createdAt: "2026-07-14T09:30:00Z",
			read: false
		},
		{
			id: crypto.randomUUID(),
			title: "Settlement queued",
			message: "A settlement batch is awaiting approval.",
			type: "settlement",
			createdAt: "2026-07-14T08:10:00Z",
			read: false
		},
		{
			id: crypto.randomUUID(),
			title: "Wallet credited",
			message: "Commission credit posted to wallet.",
			type: "wallet",
			createdAt: "2026-07-13T18:05:00Z",
			read: true
		}
	]);
	if (readStorage(STORAGE_KEYS.tickets, []).length === 0) writeStorage(STORAGE_KEYS.tickets, [
		{
			id: crypto.randomUUID(),
			subject: "Recharge failed",
			category: "Recharge",
			priority: "High",
			status: "Open",
			customer: "Asha Sharma",
			createdAt: "2026-07-14T10:12:00Z",
			message: "Mobile recharge deducted but receipt not received."
		},
		{
			id: crypto.randomUUID(),
			subject: "Wallet top-up mismatch",
			category: "Wallet",
			priority: "Medium",
			status: "Pending",
			customer: "Ravi Kumar",
			createdAt: "2026-07-13T17:10:00Z",
			message: "Bank confirmation shows an additional payment."
		},
		{
			id: crypto.randomUUID(),
			subject: "KYC document resubmission",
			category: "KYC",
			priority: "Low",
			status: "Resolved",
			customer: "Mona Das",
			createdAt: "2026-07-12T19:10:00Z",
			message: "PAN and Aadhaar were updated."
		}
	]);
	if (readStorage(STORAGE_KEYS.apiKeys, []).length === 0) writeStorage(STORAGE_KEYS.apiKeys, [{
		id: crypto.randomUUID(),
		name: "Retailer API",
		key: "pk_live_01HXXA1",
		createdAt: "2026-07-10T12:00:00Z",
		lastUsed: "2026-07-14T08:12:00Z",
		status: "Active"
	}, {
		id: crypto.randomUUID(),
		name: "Distributor Ops",
		key: "pk_live_01HXXA2",
		createdAt: "2026-07-08T16:42:00Z",
		lastUsed: "2026-07-13T21:00:00Z",
		status: "Paused"
	}]);
	if (readStorage(STORAGE_KEYS.permissions, []).length === 0) writeStorage(STORAGE_KEYS.permissions, [
		{
			id: crypto.randomUUID(),
			role: "super_admin",
			feature: "System Wallet",
			access: true
		},
		{
			id: crypto.randomUUID(),
			role: "super_admin",
			feature: "KYC Approval",
			access: true
		},
		{
			id: crypto.randomUUID(),
			role: "master_distributor",
			feature: "Distributor Creation",
			access: true
		},
		{
			id: crypto.randomUUID(),
			role: "master_distributor",
			feature: "Settlement Approval",
			access: true
		},
		{
			id: crypto.randomUUID(),
			role: "distributor",
			feature: "Retailer Creation",
			access: true
		},
		{
			id: crypto.randomUUID(),
			role: "distributor",
			feature: "Wallet Requests",
			access: true
		},
		{
			id: crypto.randomUUID(),
			role: "retailer",
			feature: "Recharge",
			access: true
		},
		{
			id: crypto.randomUUID(),
			role: "retailer",
			feature: "BBPS",
			access: true
		},
		{
			id: crypto.randomUUID(),
			role: "retailer",
			feature: "Reports",
			access: true
		},
		{
			id: crypto.randomUUID(),
			role: "agent",
			feature: "Quick Recharge",
			access: true
		},
		{
			id: crypto.randomUUID(),
			role: "agent",
			feature: "Quick AEPS",
			access: true
		}
	]);
	if (readStorage(STORAGE_KEYS.activity, []).length === 0) writeStorage(STORAGE_KEYS.activity, [
		{
			id: crypto.randomUUID(),
			title: "Recharge completed",
			detail: "Airtel prepaid recharge of ₹499 succeeded.",
			timestamp: "10 mins ago"
		},
		{
			id: crypto.randomUUID(),
			title: "Settlement approved",
			detail: "Daily settlement batch moved to processing.",
			timestamp: "1 hr ago"
		},
		{
			id: crypto.randomUUID(),
			title: "KYC verified",
			detail: "Retailer PAN and Aadhaar were verified.",
			timestamp: "3 hrs ago"
		}
	]);
	if (readStorage(STORAGE_KEYS.dmt2Requests, []).length === 0) writeStorage(STORAGE_KEYS.dmt2Requests, [{
		id: crypto.randomUUID(),
		beneficiaryName: "Priya Verma",
		bankAccount: "50100056781234",
		ifsc: "ICIC0004567",
		amount: 8500,
		submittedBy: "Asha Retailer",
		submittedByRole: "retailer",
		createdAt: "2026-07-15T10:30:00Z",
		note: "Initial request",
		status: "PendingApproval"
	}, {
		id: crypto.randomUUID(),
		beneficiaryName: "Nikhil Rao",
		bankAccount: "50200012345678",
		ifsc: "SBIN0009876",
		amount: 22e3,
		submittedBy: "Neha Agent",
		submittedByRole: "agent",
		createdAt: "2026-07-15T09:10:00Z",
		note: "Approved earlier",
		status: "Approved",
		lastUpdatedAt: "2026-07-15T09:25:00Z"
	}]);
}
seedIfNeeded();
function getDemoTransactions() {
	return readStorage(STORAGE_KEYS.transactions, []);
}
function addDemoTransaction(input) {
	const next = [...getDemoTransactions(), {
		id: crypto.randomUUID(),
		...input
	}];
	writeStorage(STORAGE_KEYS.transactions, next);
	return next[next.length - 1];
}
function getDemoNotifications() {
	return readStorage(STORAGE_KEYS.notifications, []);
}
function markNotificationRead(id) {
	const next = getDemoNotifications().map((item) => item.id === id ? {
		...item,
		read: true
	} : item);
	writeStorage(STORAGE_KEYS.notifications, next);
	return next;
}
function addDemoNotification(input) {
	const next = [{
		id: crypto.randomUUID(),
		...input
	}, ...getDemoNotifications()];
	writeStorage(STORAGE_KEYS.notifications, next);
	return next[0];
}
function getDemoTickets() {
	return readStorage(STORAGE_KEYS.tickets, []);
}
function addDemoTicket(input) {
	const next = [{
		id: crypto.randomUUID(),
		...input
	}, ...getDemoTickets()];
	writeStorage(STORAGE_KEYS.tickets, next);
	return next[0];
}
function getDemoApiKeys() {
	return readStorage(STORAGE_KEYS.apiKeys, []);
}
function addDemoApiKey(input) {
	const next = [{
		id: crypto.randomUUID(),
		...input
	}, ...getDemoApiKeys()];
	writeStorage(STORAGE_KEYS.apiKeys, next);
	return next[0];
}
function toggleDemoApiKey(id) {
	const next = getDemoApiKeys().map((item) => item.id === id ? {
		...item,
		status: item.status === "Active" ? "Paused" : "Active"
	} : item);
	writeStorage(STORAGE_KEYS.apiKeys, next);
	return next;
}
function getDemoPermissions() {
	return readStorage(STORAGE_KEYS.permissions, []);
}
function getDemoActivity() {
	return readStorage(STORAGE_KEYS.activity, []);
}
function getDemoWalletSummary() {
	const transactions = getDemoTransactions();
	return {
		totalVolume: transactions.reduce((sum, item) => sum + item.amount, 0),
		completed: transactions.filter((item) => item.status === "Success").length,
		pending: transactions.filter((item) => item.status === "Pending").length,
		failed: transactions.filter((item) => item.status === "Failed").length,
		txCount: transactions.length
	};
}
function getDemoDmt2Requests() {
	return readStorage(STORAGE_KEYS.dmt2Requests, []);
}
function addDemoDmt2Request(input) {
	const next = [{
		id: crypto.randomUUID(),
		status: "PendingApproval",
		...input
	}, ...getDemoDmt2Requests()];
	writeStorage(STORAGE_KEYS.dmt2Requests, next);
	return next[0];
}
function updateDemoDmt2RequestStatus(id, status, note) {
	const next = getDemoDmt2Requests().map((item) => item.id === id ? {
		...item,
		status,
		note: note ?? item.note,
		lastUpdatedAt: (/* @__PURE__ */ new Date()).toISOString()
	} : item);
	writeStorage(STORAGE_KEYS.dmt2Requests, next);
	return next;
}
//#endregion
export { addDemoTransaction as a, getDemoDmt2Requests as c, getDemoTickets as d, getDemoTransactions as f, updateDemoDmt2RequestStatus as g, toggleDemoApiKey as h, addDemoTicket as i, getDemoNotifications as l, markNotificationRead as m, addDemoDmt2Request as n, getDemoActivity as o, getDemoWalletSummary as p, addDemoNotification as r, getDemoApiKeys as s, addDemoApiKey as t, getDemoPermissions as u };
