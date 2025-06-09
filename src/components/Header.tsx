
import { useState } from "react";
import { HelpCircle, MessageSquare, BookOpen, GraduationCap, Plus, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../lib/store/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

const Header = () => {
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();

  const handleCreateClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/?modal=new');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold neon-glow">Meicho Shimbun RPG</h1>
      </div>
      
      <div className="flex items-center gap-4 relative">
        {/* Help icon with dropdown */}
        <div className="relative">
          <button 
            className="flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-asphalt-grey" 
            onClick={() => setHelpMenuOpen(!helpMenuOpen)}
          >
            <HelpCircle size={20} />
          </button>
          
          {helpMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg py-1 z-50">
              <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-asphalt-grey hover:text-foreground">
                <MessageSquare size={16} />
                <span>Feedback</span>
              </a>
              <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-asphalt-grey hover:text-foreground">
                <HelpCircle size={16} />
                <span>Help Center</span>
              </a>
              <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-asphalt-grey hover:text-foreground">
                <BookOpen size={16} />
                <span>Tutorials</span>
              </a>
              <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-asphalt-grey hover:text-foreground">
                <GraduationCap size={16} />
                <span>Wiki</span>
              </a>
            </div>
          )}
        </div>

        {/* User Authentication Section */}
        {user ? (
          <div className="flex items-center gap-2">
            {/* User Avatar/Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 hover:bg-asphalt-grey rounded-md p-2 transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    <User size={16} />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground max-w-32 truncate">
                  {user.email}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-asphalt-grey hover:text-foreground w-full text-left"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Create button */}
            <button 
              onClick={handleCreateClick}
              className="run-button text-white flex items-center gap-1 rounded-md px-4 py-1.5 text-sm font-medium"
            >
              <Plus size={16} />
              Create
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
            <button 
              onClick={handleCreateClick}
              className="run-button text-white flex items-center gap-1 rounded-md px-4 py-1.5 text-sm font-medium"
            >
              <Plus size={16} />
              Create
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
