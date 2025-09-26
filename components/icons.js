// Componentes de ícones SVG para o sistema AdOps
window.Icons = {
    Plus: ({ className = "w-5 h-5" }) => React.createElement("svg", {
        className,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        viewBox: "0 0 24 24"
    }, React.createElement("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M12 5v14M5 12h14"
    })),

    Search: ({ className = "w-5 h-5" }) => React.createElement("svg", {
        className,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        viewBox: "0 0 24 24"
    }, React.createElement("circle", {
        cx: "11",
        cy: "11",
        r: "8"
    }), React.createElement("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M21 21l-4.35-4.35"
    })),

    Filter: ({ className = "w-5 h-5" }) => React.createElement("svg", {
        className,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        viewBox: "0 0 24 24"
    }, React.createElement("polygon", {
        points: "22,3 2,3 10,12.46 10,19 14,21 14,12.46"
    })),

    CheckCircle: ({ className = "w-5 h-5" }) => React.createElement("svg", {
        className,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        viewBox: "0 0 24 24"
    }, React.createElement("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M22 11.08V12a10 10 0 1 1-5.93-9.14"
    }), React.createElement("polyline", {
        points: "22,4 12,14.01 9,11.01"
    })),

    XCircle: ({ className = "w-5 h-5" }) => React.createElement("svg", {
        className,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        viewBox: "0 0 24 24"
    }, React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "10"
    }), React.createElement("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "15 9l-6 6M9 9l6 6"
    })),

    Clock: ({ className = "w-5 h-5" }) => React.createElement("svg", {
        className,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        viewBox: "0 0 24 24"
    }, React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "10"
    }), React.createElement("polyline", {
        points: "12,6 12,12 16,14"
    })),

    Play: ({ className = "w-5 h-5" }) => React.createElement("svg", {
        className,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        viewBox: "0 0 24 24"
    }, React.createElement("polygon", {
        points: "5,3 19,12 5,21"
    })),

    Pause: ({ className = "w-5 h-5" }) => React.createElement("svg", {
        className,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        viewBox: "0 0 24 24"
    }, React.createElement("rect", {
        height: "16",
        rx: "2",
        ry: "2",
        width: "4",
        x: "6",
        y: "4"
    }), React.createElement("rect", {
        height: "16",
        rx: "2",
        ry: "2",
        width: "4",
        x: "14",
        y: "4"
    })),

    Edit2: ({ className = "w-4 h-4" }) => React.createElement("svg", {
        className,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        viewBox: "0 0 24 24"
    }, React.createElement("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"
    }), React.createElement("path", {
        d: "15 5l4 4"
    })),

    Trash2: ({ className = "w-4 h-4" }) => React.createElement("svg", {
        className,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        viewBox: "0 0 24 24"
    }, React.createElement("polyline", {
        points: "3,6 5,6 21,6"
    }), React.createElement("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
    }), React.createElement("line", {
        x1: "10",
        x2: "10",
        y1: "11",
        y2: "17"
    }), React.createElement("line", {
        x1: "14",
        x2: "14",
        y1: "11",
        y2: "17"
    })),

    User: ({ className = "w-5 h-5" }) => React.createElement("svg", {
        className,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        viewBox: "0 0 24 24"
    }, React.createElement("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
    }), React.createElement("circle", {
        cx: "12",
        cy: "7",
        r: "4"
    })),

    Calendar: ({ className = "w-4 h-4" }) => React.createElement("svg", {
        className,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        viewBox: "0 0 24 24"
    }, React.createElement("path", {
        d: "M8 2v4M16 2v4"
    }), React.createElement("rect", {
        height: "18",
        rx: "2",
        ry: "2",
        width: "18",
        x: "3",
        y: "4"
    }), React.createElement("path", {
        d: "M3 10h18"
    })),

    Globe: ({ className = "w-4 h-4" }) => React.createElement("svg", {
        className,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        viewBox: "0 0 24 24"
    }, React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "10"
    }), React.createElement("path", {
        d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"
    }), React.createElement("path", {
        d: "M2 12h20"
    })),

    FileText: ({ className = "w-4 h-4" }) => React.createElement("svg", {
        className,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        viewBox: "0 0 24 24"
    }, React.createElement("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
    }), React.createElement("path", {
        d: "M14 2v4a2 2 0 0 0 2 2h4"
    }), React.createElement("path", {
        d: "M10 9H8M16 13H8M16 17H8"
    })),

    RefreshCw: ({ className = "w-4 h-4" }) => React.createElement("svg", {
        className,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        viewBox: "0 0 24 24"
    }, React.createElement("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"
    }), React.createElement("path", {
        d: "M21 3v5h-5"
    }), React.createElement("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"
    }), React.createElement("path", {
        d: "M3 21v-5h5"
    })),

    Wifi: ({ className = "w-4 h-4" }) => React.createElement("svg", {
        className,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        viewBox: "0 0 24 24"
    }, React.createElement("path", {
        d: "M12 20h.01"
    }), React.createElement("path", {
        d: "M2 8.82a15 15 0 0 1 20 0"
    }), React.createElement("path", {
        d: "M5 12.859a10 10 0 0 1 14 0"
    }), React.createElement("path", {
        d: "M8.5 16.429a5 5 0 0 1 7 0"
    })),

    WifiOff: ({ className = "w-4 h-4" }) => React.createElement("svg", {
        className,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        viewBox: "0 0 24 24"
    }, React.createElement("path", {
        d: "M12 20h.01"
    }), React.createElement("path", {
        d: "M8.5 16.429a5 5 0 0 1 7 0"
    }), React.createElement("path", {
        d: "M5 12.859a10 10 0 0 1 5.17-2.69"
    }), React.createElement("path", {
        d: "M19 12.859a10 10 0 0 0-2.007-1.523"
    }), React.createElement("path", {
        d: "M2 8.82a15 15 0 0 1 4.177-2.643"
    }), React.createElement("path", {
        d: "M22 8.82a15 15 0 0 0-11.288-3.764"
    }), React.createElement("path", {
        d: "M2 2l20 20"
    })),

    AlertCircle: ({ className = "w-4 h-4" }) => React.createElement("svg", {
        className,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        viewBox: "0 0 24 24"
    }, React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "10"
    }), React.createElement("line", {
        x1: "12",
        x2: "12",
        y1: "8",
        y2: "12"
    }), React.createElement("line", {
        x1: "12",
        x2: "12.01",
        y1: "16",
        y2: "16"
    })),

    TrendingUp: ({ className = "w-4 h-4" }) => React.createElement("svg", {
        className,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        viewBox: "0 0 24 24"
    }, React.createElement("polyline", {
        points: "22,7 13.5,15.5 8.5,10.5 2,17"
    }), React.createElement("polyline", {
        points: "16,7 22,7 22,13"
    })),

    Download: ({ className = "w-4 h-4" }) => React.createElement("svg", {
        className,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        viewBox: "0 0 24 24"
    }, React.createElement("path", {
        d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
    }), React.createElement("polyline", {
        points: "7,10 12,15 17,10"
    }), React.createElement("line", {
        x1: "12",
        x2: "12",
        y1: "15",
        y2: "3"
    })),

    Upload: ({ className = "w-4 h-4" }) => React.createElement("svg", {
        className,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        viewBox: "0 0 24 24"
    }, React.createElement("path", {
        d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
    }), React.createElement("polyline", {
        points: "17,8 12,3 7,8"
    }), React.createElement("line", {
        x1: "12",
        x2: "12",
        y1: "3",
        y2: "15"
    }))
};

// Helper function para usar ícones
window.Icons.getStatusIcon = (status, className = "w-5 h-5") => {
    const iconProps = { className };
    switch (status) {
        case 'Completed': 
            return React.createElement(window.Icons.CheckCircle, { ...iconProps, className: `${className} text-green-500` });
        case 'Analyzed': 
            return React.createElement(window.Icons.CheckCircle, { ...iconProps, className: `${className} text-blue-500` });
        case 'Blocked': 
            return React.createElement(window.Icons.XCircle, { ...iconProps, className: `${className} text-red-500` });
        case 'In progress': 
            return React.createElement(window.Icons.Play, { ...iconProps, className: `${className} text-yellow-500` });
        case 'Paused': 
            return React.createElement(window.Icons.Pause, { ...iconProps, className: `${className} text-orange-500` });
        default: 
            return React.createElement(window.Icons.Clock, { ...iconProps, className: `${className} text-gray-500` });
    }
};

console.log('✅ Ícones carregados:', Object.keys(window.Icons).length, 'componentes');