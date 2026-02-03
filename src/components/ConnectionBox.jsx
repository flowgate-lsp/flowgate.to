import { useState } from 'react';
import { Copy, Check, Terminal, Wifi } from 'lucide-react';

const ConnectionBox = ({ connectionString }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(connectionString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="connection-wrapper hud-panel">
             <div className="connection-label-row">
                <div className="label-group">
                    <Terminal size={14} className="label-icon"/>
                    <span className="label-text">PUBLIC NODE ENTRYPOINT</span>
                </div>

            </div>

            <div className="connection-data-block">
                <code className="connection-string">
                    {connectionString}
                </code>
                <button 
                    onClick={copyToClipboard} 
                    className={`copy-action ${copied ? 'copied' : ''}`}
                    title={copied ? "Copied!" : "Copy URI"}
                >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
            </div>
        </div>
    );
};

export default ConnectionBox;
