import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useSession } from "@/hooks/use-session";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Search,
  Shield,
  CheckCircle2,
  PauseCircle,
  Loader2,
  Copy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createDownlineUser,
  listDownlineUsers,
  setUserStatus,
} from "@/lib/admin-users.functions";

export const Route = createFileRoute("/_app/users")({
  component: UsersPage,
});

type DownlineUser = {
  id: string;
  full_name: string;
  mobile: string;
  email: string | null;
  username: string | null;
  status: string;
  kyc_status: string;
  business_name: string | null;
  city: string | null;
  state: string | null;
  parent_id: string | null;
  last_login_at: string | null;
  created_at: string;
  roles: string[];
};

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  master_distributor: "Master Distributor",
  distributor: "Distributor",
  retailer: "Retailer",
  agent: "Agent",
  support: "Support",
  auditor: "Auditor",
};

function UsersPage() {
  const list = useServerFn(listDownlineUsers);
  const qc = useQueryClient();
  const { primaryRole } = useSession();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const usersQuery = useQuery({
    queryKey: ["downline-users"],
    queryFn: () => list(),
  });

  const filtered = (usersQuery.data?.users ?? []).filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.full_name.toLowerCase().includes(q) ||
      u.mobile.includes(q) ||
      (u.username ?? "").toLowerCase().includes(q) ||
      (u.business_name ?? "").toLowerCase().includes(q)
    );
  });

  const creatable = usersQuery.data?.creatableRoles ?? [];
  const canCreate = primaryRole === "super_admin" || creatable.length > 0;
  const effectiveCreatableRoles = primaryRole === "super_admin" ? ["master_distributor", "distributor", "retailer", "agent", "super_admin"] : creatable;

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            User Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage your downline. Each tier can only create the tier
            directly below it.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name, mobile, username…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 w-72"
            />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="default"
                size="lg"
                disabled={!canCreate}
                className="gap-2"
              >
                <UserPlus className="h-4 w-4" />
                New user
              </Button>
            </DialogTrigger>
            <CreateUserDialog
              creatableRoles={effectiveCreatableRoles}
              onCreated={() => {
                setOpen(false);
                qc.invalidateQueries({ queryKey: ["downline-users"] });
              }}
            />
          </Dialog>
        </div>
      </motion.div>

      {usersQuery.data?.callerRoles.length ? (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground pr-1">Your roles:</span>
          {usersQuery.data.callerRoles.map((r) => (
            <Badge key={r} variant="secondary" className="gap-1">
              <Shield className="h-3 w-3" />
              {ROLE_LABEL[r] ?? r}
            </Badge>
          ))}
        </div>
      ) : null}

      <div className="rounded-xl border bg-card overflow-hidden">
        {usersQuery.isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              {search
                ? "No users match your search."
                : "No downline users yet. Click ‘New user’ to add one."}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <UserRow key={u.id} user={u as DownlineUser} />
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function UserRow({ user }: { user: DownlineUser }) {
  const qc = useQueryClient();
  const setStatus = useServerFn(setUserStatus);
  const mutation = useMutation({
    mutationFn: (status: "active" | "suspended") =>
      setStatus({ data: { userId: user.id, status } }),
    onSuccess: () => {
      toast.success("User updated");
      qc.invalidateQueries({ queryKey: ["downline-users"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const primaryRole = user.roles[0] ?? "—";
  const isActive = user.status === "active";

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{user.full_name}</div>
        {user.business_name && (
          <div className="text-xs text-muted-foreground">{user.business_name}</div>
        )}
      </TableCell>
      <TableCell>
        <Badge variant="outline">{ROLE_LABEL[primaryRole] ?? primaryRole}</Badge>
      </TableCell>
      <TableCell className="font-mono text-sm">+91 {user.mobile}</TableCell>
      <TableCell className="text-sm">{user.username ?? "—"}</TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {[user.city, user.state].filter(Boolean).join(", ") || "—"}
      </TableCell>
      <TableCell>
        {isActive ? (
          <Badge className="gap-1 bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20 border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" />
            Active
          </Badge>
        ) : (
          <Badge variant="secondary" className="gap-1">
            <PauseCircle className="h-3 w-3" />
            {user.status}
          </Badge>
        )}
      </TableCell>
      <TableCell className="text-right">
        <Button
          size="sm"
          variant={isActive ? "outline" : "default"}
          disabled={mutation.isPending}
          onClick={() => mutation.mutate(isActive ? "suspended" : "active")}
        >
          {mutation.isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : isActive ? (
            "Suspend"
          ) : (
            "Activate"
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
}

function CreateUserDialog({
  creatableRoles,
  onCreated,
}: {
  creatableRoles: string[];
  onCreated: () => void;
}) {
  const create = useServerFn(createDownlineUser);
  const [role, setRole] = useState<string>(creatableRoles[0] ?? "retailer");
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const needsPassword = role === "super_admin" || role === "master_distributor" || role === "distributor";

  const mutation = useMutation({
    mutationFn: () =>
      create({
        data: {
          fullName,
          mobile,
          email,
          username,
          password,
          role: role as
            | "super_admin"
            | "master_distributor"
            | "distributor"
            | "retailer"
            | "agent",
          businessName,
          city,
          state,
        },
      }),
    onSuccess: () => {
      toast.success(`${ROLE_LABEL[role] ?? role} created`);
      setFullName("");
      setMobile("");
      setEmail("");
      setUsername("");
      setPassword("");
      setBusinessName("");
      setCity("");
      setState("");
      onCreated();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to create user"),
  });

  const genPassword = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let p = "";
    for (let i = 0; i < 10; i++) p += chars[Math.floor(Math.random() * chars.length)];
    setPassword(p + "@1");
  };

  return (
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>Create downline user</DialogTitle>
        <DialogDescription>
          The new user will be linked to you as their parent in the hierarchy.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Role *</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {creatableRoles.map((r) => (
                  <SelectItem key={r} value={r}>
                    {ROLE_LABEL[r] ?? r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Full name *</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Rohan Sharma" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Mobile *</Label>
            <Input
              inputMode="numeric"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="9876543210"
            />
          </div>
          <div className="space-y-2">
            <Label>Email (optional)</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@company.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Username {needsPassword && "*"}</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="rohan.s"
            />
          </div>
          <div className="space-y-2">
            <Label>Password {needsPassword && "*"}</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 chars"
              />
              <Button type="button" variant="outline" size="sm" onClick={genPassword}>
                Generate
              </Button>
              {password && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(password);
                    toast.success("Copied");
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2 col-span-3">
            <Label>Business name</Label>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Sharma Communications"
            />
          </div>
          <div className="space-y-2 col-span-2">
            <Label>City</Label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>State</Label>
            <Input value={state} onChange={(e) => setState(e.target.value)} />
          </div>
        </div>

        {needsPassword && (
          <p className="text-xs text-muted-foreground">
            Admin / staff roles require a username + password. Retailers and agents
            sign in via mobile OTP.
          </p>
        )}
      </div>

      <DialogFooter>
        <Button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || !fullName || !/^[6-9]\d{9}$/.test(mobile)}
          size="lg"
        >
          {mutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Create user
            </>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
