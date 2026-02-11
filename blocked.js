const urlParams = new URLSearchParams(window.location.search);
const originalUrl = urlParams.get('url') ? decodeURIComponent(urlParams.get('url')) : null;
const blockedHost = originalUrl ? new URL(originalUrl).hostname : 'unknown';

document.getElementById('currentUrl').textContent = blockedHost;

const achievements = [
    "Novice Resister", "Casual Avoider", "Occasional Abstainer", "Tentative Refuser", "Reluctant Abstainer",
    "Nascent Self-Control", "Emerging Discipline", "Fledgling Resolve", "Sprouting Willpower", "Budding Self-Restraint",
    "Initial Success", "Early Achiever", "First Week Warrior", "Cautious Avoider", "Guarded Resister",
    "Developing Self-Control", "Growing Resolve", "Steady Progress", "Consistent Abstainer", "Reliable Refuser",
    "Trustworthy Abstainer", "Established Discipline", "Strong Willpower", "Confident Resister", "Assertive Avoider",
    "One Month Milestone", "Firm Foundation", "Building Momentum", "Dedicated Avoider", "Steady Strider",
    "Enduring Self-Control", "Resolute Refuser", "Firm Resolve", "Unwavering Abstainer", "Daily Champion",
    "Habitual Avoider", "Conditioned Resister", "Seasoned Self-Control", "Experienced Abstainer", "Skilled Refuser",
    "Proficient Avoider", "Two Month Tribute", "Noteworthy Achievement", "Commendable Restraint", "Admirable Self-Control",
    "Lauded Resolve", "Exemplary Abstainer", "Outstanding Refuser", "Exceptional Avoider", "Tenacious Abstainer",
    "Persistent Resister", "Dedicated Self-Control", "Consistent Winner", "Steady Hand", "Reliable Avoider",
    "Trusted Resister", "Determined Abstainer", "Proud Achiever", "Iron Will", "Focused Refuser",
    "Three Month Milestone", "Significant Achievement", "Notable Progress", "Considerable Restraint", "Impressive Self-Control",
    "Disciplined Achiever", "Steadfast Avoider", "Proven Resister", "Assertive Winner", "Four Month Mark",
    "Substantial Achievement", "Considerable Resolve", "Remarkable Abstainer", "Extraordinary Refuser", "Five Month Tribute",
    "Outstanding Achievement", "Exemplary Self-Control", "Distinguished Resolve", "Honorable Abstainer", "Trusted Champion",
    "Consistent Mastery", "Persistent Avoider", "Loyal Resister", "Enduring Willpower", "Resilient Achiever",
    "Determined Victor", "Courageous Abstainer", "Focused Achiever", "True Resister", "Steady Victor",
    "Six Month Milestone", "Major Achievement", "Notable Self-Control", "Significant Resolve", "Commendable Avoider",
    "Seven Month Mark", "Impressive Achievement", "Considerable Self-Restraint", "Remarkable Refuser", "Eight Month Tribute",
    "Exceptional Achievement", "Outstanding Self-Control", "Distinguished Abstainer", "Nine Month Milestone", "Major Self-Restraint",
    "Significant Avoider", "Ten Month Mark", "Extraordinary Achievement", "Unwavering Resolve", "Impressive Refuser",
    "Eleven Month Tribute", "Outstanding Abstainer", "Year Approaches", "Veteran Avoider", "Proven Champion",
    "Elite Resister", "Skilled Abstainer", "Master of Self-Control", "Disciplined Victor", "Champion of Resolve",
    "Self-Control Strategist", "Abstention Specialist", "Refusal Expert", "Willpower Warrior", "Persistent Champion",
    "Abstention Master", "Resolution Leader", "Victory Architect", "Consistency Commander", "Dedicated Victor",
    "Abstention Hero", "Self-Control Guardian", "Persistence Prodigy", "Abstention Tactician", "Determination Architect",
    "Abstention Sage", "Veteran Champion", "Steadfast Hero", "Willpower Master", "Self-Control Sage",
    "Discipline Elder", "Abstention Veteran", "Resister Sage", "Abstention Maestro", "Abstention Luminary",
    "Abstention Icon", "Abstention Sentinel", "Abstention Protector", "Abstention Paladin", "Abstention Titan",
    "Abstention Legend", "Abstention Virtuoso", "Abstention Monarch", "Abstention Emperor", "Abstention Immortal",
    "Abstention Conqueror", "Abstention Victor Supreme", "Abstention Paragon", "Abstention Hero Supreme", "Abstention Champion Supreme",
    "Abstention Overlord", "Abstention Sage Supreme", "Abstention Grandmaster", "Abstention Legend Supreme", "Abstention Godlike",
    "Abstention Invincible", "Abstention Unyielding", "Abstention Unbreakable", "Abstention Eternal", "Abstention Infinity",
    "Abstention Apex", "Abstention Pinnacle", "Abstention Zenith", "Abstention Summit", "Abstention Peak",
    "Abstention Paramount", "Abstention Supreme", "Abstention Ultimate", "Abstention Absolute", "Abstention Maximum",
    "One Year Anniversary", "Exemplary Achievement", "Distinguished Self-Control", "Honorable Refuser", "Year and One Day",
    "Year and Two Days", "Year and Three Days", "Year and One Week", "Year and Two Weeks", "Consistent Achiever",
    "Reliable Resister", "Steady Abstainer", "Firm Self-Control", "Confident Avoider", "Assertive Refuser",
    "Seasoned Abstainer", "Experienced Resister", "Skilled Avoider", "Proficient Refuser", "Two Hundred Days",
    "Patient Guardian", "Humble Warrior", "Perseverance Master", "Endurance Champion", "Wisdom Keeper",
    "Fortitude Hero", "Steadfast Sage", "Resilient Spirit", "Tranquil Mind", "Balanced Soul",
    "Calm Presence", "Focused Heart", "Determined Mind", "Peaceful Warrior", "Patient Sage",
    "Humble Champion", "Persistent Soul", "Enduring Spirit", "Wise Guardian", "Fortified Mind",
    "Serene Warrior", "Balanced Guardian", "Tranquil Champion", "Mindful Sage", "Centered Soul",
    "Graceful Resister", "Composed Champion", "Disciplined Spirit", "Harmonious Mind", "Peaceful Guardian",
    "Patient Master", "Humble Victor", "Perseverant Soul", "Enduring Sage", "Wise Champion",
    "Fortified Spirit", "Steadfast Mind", "Resilient Guardian", "Tranquil Soul", "Balanced Warrior",
    "Calm Champion", "Focused Sage", "Determined Guardian", "Peaceful Spirit", "Patient Hero",
    "Humble Master", "Persistent Champion", "Enduring Mind", "Wise Spirit", "Fortified Guardian",
    "Serene Champion", "Balanced Mind", "Tranquil Warrior", "Mindful Guardian", "Centered Champion",
    "Graceful Spirit", "Composed Mind", "Disciplined Guardian", "Harmonious Champion", "Peaceful Mind",
    "Patient Spirit", "Humble Guardian", "Perseverant Champion", "Enduring Hero", "Wise Mind",
    "Fortified Champion", "Steadfast Spirit", "Resilient Mind", "Tranquil Guardian", "Balanced Champion",
    "Calm Spirit", "Focused Mind", "Determined Champion", "Peaceful Guardian", "Patient Mind",
    "Humble Spirit", "Persistent Guardian", "Enduring Champion", "Wise Hero", "Fortified Mind",
    "Serene Spirit", "Balanced Guardian", "Tranquil Champion", "Mindful Mind", "Centered Spirit",
    "Graceful Guardian", "Composed Champion", "Disciplined Mind", "Harmonious Spirit", "Peaceful Champion",
    "Patient Guardian", "Humble Mind", "Perseverant Spirit", "Enduring Guardian", "Wise Champion",
    "Fortified Spirit", "Steadfast Guardian", "Resilient Champion", "Tranquil Mind", "Balanced Spirit",
    "Calm Guardian", "Focused Champion", "Determined Mind", "Peaceful Spirit", "Patient Champion",
    "Humble Guardian", "Persistent Mind", "Enduring Spirit", "Wise Guardian", "Fortified Champion",
    "Serene Mind", "Balanced Champion", "Tranquil Spirit", "Mindful Guardian", "Centered Mind",
    "Graceful Champion", "Composed Spirit", "Disciplined Guardian", "Harmonious Mind", "Peaceful Spirit",
    "Patient Mind", "Humble Champion", "Perseverant Guardian", "Enduring Mind", "Wise Spirit",
    "Fortified Guardian", "Steadfast Champion", "Resilient Spirit", "Tranquil Champion", "Balanced Mind",
    "Calm Champion", "Focused Spirit", "Determined Guardian", "Peaceful Mind", "Patient Spirit",
    "Humble Mind", "Persistent Champion", "Enduring Guardian", "Wise Mind", "Fortified Spirit",
    "Serene Guardian", "Balanced Spirit", "Tranquil Mind", "Mindful Champion", "Centered Guardian",
    "Graceful Spirit", "Composed Mind", "Disciplined Champion", "Harmonious Guardian", "Peaceful Spirit",
    "Patient Guardian", "Humble Spirit", "Perseverant Mind", "Enduring Champion", "Wise Guardian",
    "Fortified Mind", "Steadfast Spirit", "Resilient Guardian", "Tranquil Spirit", "Balanced Champion",
    "Calm Mind", "Focused Guardian", "Determined Spirit", "Peaceful Champion", "Patient Mind",
    "Humble Guardian", "Persistent Spirit", "Enduring Mind", "Wise Champion", "Fortified Guardian",
    "Serene Champion", "Balanced Mind", "Tranquil Guardian", "Mindful Spirit", "Centered Champion",
    "Graceful Mind", "Composed Guardian", "Disciplined Spirit", "Harmonious Champion", "Peaceful Guardian",
    "Patient Champion", "Humble Mind", "Perseverant Guardian", "Enduring Spirit", "Wise Mind",
    "Fortified Champion", "Steadfast Guardian", "Resilient Mind", "Tranquil Champion", "Balanced Guardian",
    "Calm Spirit", "Focused Mind", "Determined Champion", "Peaceful Guardian", "Patient Spirit",
    "Humble Champion", "Persistent Mind", "Enduring Guardian", "Wise Spirit", "Fortified Mind",
    "Serene Guardian", "Balanced Champion", "Tranquil Mind", "Mindful Guardian", "Centered Spirit",
    "Graceful Champion", "Composed Spirit", "Disciplined Mind", "Harmonious Guardian", "Peaceful Mind",
    "Unshakeable Self-Control", "Unrelenting Abstainer", "Legendary Self-Control", "Heroic Abstainer", "Iconic Refuser"
];

const hourlyAchievements = [
    "Don't even think about it",
    "Resist with everything you've got",
    "Stay strong and don't give in now",
    "You've come too far to turn back",
    "Don't throw away all your progress",
    "Keep your hands off that unblock button",
    "Resist like your life depends on it",
    "Don't let a moment of weakness destroy everything",
    "Stay the course and don't look back",
    "You're stronger than this urge right now",
    "Don't cave in when you're so close",
    "Hold the line and don't surrender now",
    "Resist this temptation with all your might",
    "Don't undo everything you've worked for",
    "Stay firm and don't even consider it",
    "You'll regret it the moment you click unblock",
    "Don't let one bad decision ruin your streak",
    "Resist now and thank yourself later tonight",
    "Stay disciplined when it matters most right now",
    "Don't give up on yourself at this moment",
    "Hold strong and push through this feeling",
    "You're better than this urge right now",
    "Don't betray yourself after coming this far",
    "Resist and win this battle tonight"
];

function getAchievement(days, hours) {
    if (days >= 366) {
        return "Conquered Completely";
    }
    if (days >= 1 && days <= 365) {
        return achievements[days - 1] || "Champion";
    }
    if (days < 1 && hours >= 0 && hours < 24) {
        return hourlyAchievements[hours] || hourlyAchievements[0];
    }
    return "";
}

async function loadBlockedDuration() {
    const { siteBlockTimestamps = {} } = 
        await browser.storage.local.get('siteBlockTimestamps');
    
    const timestamp = siteBlockTimestamps[blockedHost];
    
    if (timestamp) {
        const now = Date.now();
        const totalMinutes = Math.floor((now - timestamp) / (1000 * 60));
        const hoursBlocked = Math.floor(totalMinutes / 60);
        const minutesBlocked = totalMinutes % 60;
        const daysBlocked = Math.floor(hoursBlocked / 24);
        
        let durationText;
        if (totalMinutes < 60) {
            durationText = `for ${totalMinutes}m`;
        } else if (hoursBlocked < 24) {
            if (minutesBlocked === 0) {
                durationText = `for ${hoursBlocked}h`;
            } else {
                durationText = `for ${hoursBlocked}h ${minutesBlocked}m`;
            }
        } else {
            durationText = `for ${daysBlocked} ${daysBlocked === 1 ? 'day' : 'days'}`;
        }
        
        document.getElementById('duration').textContent = durationText;
        
        const achievement = getAchievement(daysBlocked, hoursBlocked);
        document.getElementById('achievement').textContent = achievement;
    } else {
        document.getElementById('duration').textContent = 'for 0m';
    }
}

document.getElementById('unblockBtn').addEventListener('click', async () => {
    const { siteBlockTimestamps = {} } = 
        await browser.storage.local.get('siteBlockTimestamps');
    
    delete siteBlockTimestamps[blockedHost];
    
    await browser.storage.local.set({ 
        siteBlockTimestamps: siteBlockTimestamps
    });
    
    setTimeout(() => {
        window.location.href = originalUrl;
    }, 100);
});

loadBlockedDuration();