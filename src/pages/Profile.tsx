import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery } from "@apollo/client";
import { GET_PROFILE } from "@/lib/graphql/queries";
import { UPDATE_PROFILE } from "@/lib/graphql/mutations";

export default function Profile() {
  const { user, updateProfile: authUpdateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(
    user?.user_metadata?.full_name || ""
  );
  const [avatarUrl, setAvatarUrl] = useState(
    user?.user_metadata?.avatar_url || ""
  );
  const email = user?.email || "";

  // GraphQL query for profile
  const {
    data,
    loading: profileLoading,
    error,
  } = useQuery(GET_PROFILE, {
    variables: { userId: user?.id },
    skip: !user?.id,
    fetchPolicy: "network-only",
  });

  // GraphQL mutation for updating profile
  const [updateProfileMutation] = useMutation(UPDATE_PROFILE);

  // Update form state when profile data is loaded
  useEffect(() => {
    if (
      data &&
      data.profilesCollection &&
      data.profilesCollection.edges.length > 0
    ) {
      const profile = data.profilesCollection.edges[0].node;
      setFullName(profile.full_name || "");
      setAvatarUrl(profile.avatar_url || "");
    }
  }, [data]);

  // Handle GraphQL errors
  useEffect(() => {
    if (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    }
  }, [error]);

  async function handleUpdateProfile() {
    try {
      setLoading(true);

      if (!user) {
        throw new Error("Not authenticated");
      }

      // Update auth metadata
      const success = await authUpdateProfile({
        fullName,
        avatarUrl,
      });

      if (!success) {
        throw new Error("Failed to update profile");
      }

      // Update profile in database using GraphQL
      const { errors } = await updateProfileMutation({
        variables: {
          id: user.id,
          updates: {
            full_name: fullName,
            avatar_url: avatarUrl,
          },
        },
      });

      if (errors) {
        throw errors;
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }
  console.log("avatarUrl", avatarUrl);
  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              View and update your profile information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatarUrl} alt={fullName} />
                  <AvatarFallback className="text-lg">
                    {fullName ? fullName.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <h3 className="text-xl font-medium">{fullName || "User"}</h3>
                  <p className="text-sm text-muted-foreground">{email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar-url">Avatar URL</Label>
                  <Input
                    id="avatar-url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="Enter URL for your avatar image"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>

                <Button
                  onClick={handleUpdateProfile}
                  disabled={loading || profileLoading}
                  className="mt-4"
                >
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
